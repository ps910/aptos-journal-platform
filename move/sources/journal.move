module journal_platform::journal {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_JOURNAL_NOT_FOUND: u64 = 3;
    const E_NOT_OWNER: u64 = 4;
    const E_INSUFFICIENT_BALANCE: u64 = 5;
    const E_ALREADY_READ: u64 = 6;

    // Fee constants (in Octas - 1 APT = 100,000,000 Octas)
    const ADD_JOURNAL_FEE: u64 = 10000000; // 0.1 APT
    const READ_JOURNAL_FEE: u64 = 5000000; // 0.05 APT

    // Journal entry structure
    struct Journal has store, drop, copy {
        id: u64,
        owner: address,
        title: String,
        content: String,
        created_at: u64,
        total_reads: u64,
        total_earned: u64,
        is_active: bool,
    }

    // Platform resource to store all journals
    struct JournalPlatform has key {
        journals: Table<u64, Journal>,
        journal_counter: u64,
        platform_balance: u64,
        user_journals: Table<address, vector<u64>>,
    }

    // Read tracking
    struct ReadTracker has key {
        read_journals: Table<u64, bool>,
    }

    // Events
    struct JournalCreatedEvent has drop, store {
        journal_id: u64,
        owner: address,
        title: String,
        fee_paid: u64,
    }

    struct JournalReadEvent has drop, store {
        journal_id: u64,
        reader: address,
        owner: address,
        fee_paid: u64,
    }

    struct JournalReclaimedEvent has drop, store {
        journal_id: u64,
        owner: address,
        amount_reclaimed: u64,
    }

    struct PlatformEvents has key {
        journal_created_events: event::EventHandle<JournalCreatedEvent>,
        journal_read_events: event::EventHandle<JournalReadEvent>,
        journal_reclaimed_events: event::EventHandle<JournalReclaimedEvent>,
    }

    // Initialize the platform (call once by deployer)
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<JournalPlatform>(account_addr), E_ALREADY_INITIALIZED);

        move_to(account, JournalPlatform {
            journals: table::new(),
            journal_counter: 0,
            platform_balance: 0,
            user_journals: table::new(),
        });

        move_to(account, PlatformEvents {
            journal_created_events: account::new_event_handle<JournalCreatedEvent>(account),
            journal_read_events: account::new_event_handle<JournalReadEvent>(account),
            journal_reclaimed_events: account::new_event_handle<JournalReclaimedEvent>(account),
        });
    }

    // Initialize read tracker for a user
    public entry fun initialize_read_tracker(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<ReadTracker>(account_addr)) {
            move_to(account, ReadTracker {
                read_journals: table::new(),
            });
        };
    }

    // Add a new journal entry (user pays fee)
    public entry fun add_journal(
        account: &signer,
        platform_address: address,
        title: String,
        content: String,
    ) acquires JournalPlatform, PlatformEvents {
        let account_addr = signer::address_of(account);
        
        // Pay the fee
        let fee = coin::withdraw<AptosCoin>(account, ADD_JOURNAL_FEE);
        coin::deposit(platform_address, fee);

        // Add journal
        let platform = borrow_global_mut<JournalPlatform>(platform_address);
        let journal_id = platform.journal_counter;
        
        let journal = Journal {
            id: journal_id,
            owner: account_addr,
            title,
            content,
            created_at: aptos_framework::timestamp::now_seconds(),
            total_reads: 0,
            total_earned: 0,
            is_active: true,
        };

        table::add(&mut platform.journals, journal_id, journal);
        platform.journal_counter = journal_id + 1;
        platform.platform_balance = platform.platform_balance + ADD_JOURNAL_FEE;

        // Track user's journals
        if (!table::contains(&platform.user_journals, account_addr)) {
            table::add(&mut platform.user_journals, account_addr, vector::empty<u64>());
        };
        let user_journal_list = table::borrow_mut(&mut platform.user_journals, account_addr);
        vector::push_back(user_journal_list, journal_id);

        // Emit event
        let events = borrow_global_mut<PlatformEvents>(platform_address);
        event::emit_event(&mut events.journal_created_events, JournalCreatedEvent {
            journal_id,
            owner: account_addr,
            title,
            fee_paid: ADD_JOURNAL_FEE,
        });
    }

    // Read a journal (reader pays fee to owner)
    public entry fun read_journal(
        account: &signer,
        platform_address: address,
        journal_id: u64,
    ) acquires JournalPlatform, ReadTracker, PlatformEvents {
        let account_addr = signer::address_of(account);
        
        // Check if already read
        if (!exists<ReadTracker>(account_addr)) {
            initialize_read_tracker(account);
        };
        
        let read_tracker = borrow_global_mut<ReadTracker>(account_addr);
        assert!(!table::contains(&read_tracker.read_journals, journal_id), E_ALREADY_READ);

        let platform = borrow_global_mut<JournalPlatform>(platform_address);
        assert!(table::contains(&platform.journals, journal_id), E_JOURNAL_NOT_FOUND);
        
        let journal = table::borrow_mut(&mut platform.journals, journal_id);
        let owner_addr = journal.owner;

        // Don't charge owner to read their own journal
        if (account_addr != owner_addr) {
            // Pay reading fee to journal owner
            let fee = coin::withdraw<AptosCoin>(account, READ_JOURNAL_FEE);
            coin::deposit(owner_addr, fee);

            // Update journal stats
            journal.total_reads = journal.total_reads + 1;
            journal.total_earned = journal.total_earned + READ_JOURNAL_FEE;

            // Emit event
            let events = borrow_global_mut<PlatformEvents>(platform_address);
            event::emit_event(&mut events.journal_read_events, JournalReadEvent {
                journal_id,
                reader: account_addr,
                owner: owner_addr,
                fee_paid: READ_JOURNAL_FEE,
            });
        };

        // Mark as read
        table::add(&mut read_tracker.read_journals, journal_id, true);
    }

    // Reclaim journal (deactivate and get refund of add fee)
    public entry fun reclaim_journal(
        account: &signer,
        platform_address: address,
        journal_id: u64,
    ) acquires JournalPlatform, PlatformEvents {
        let account_addr = signer::address_of(account);
        
        let platform = borrow_global_mut<JournalPlatform>(platform_address);
        assert!(table::contains(&platform.journals, journal_id), E_JOURNAL_NOT_FOUND);
        
        let journal = table::borrow_mut(&mut platform.journals, journal_id);
        assert!(journal.owner == account_addr, E_NOT_OWNER);
        assert!(journal.is_active, E_JOURNAL_NOT_FOUND);

        // Deactivate journal
        journal.is_active = false;

        // Refund the add fee from platform balance
        assert!(platform.platform_balance >= ADD_JOURNAL_FEE, E_INSUFFICIENT_BALANCE);
        platform.platform_balance = platform.platform_balance - ADD_JOURNAL_FEE;

        // Transfer refund to owner
        let refund = coin::withdraw<AptosCoin>(account, 0); // Create empty coin
        coin::merge(&mut refund, coin::withdraw<AptosCoin>(account, ADD_JOURNAL_FEE));
        coin::deposit(account_addr, refund);

        // Emit event
        let events = borrow_global_mut<PlatformEvents>(platform_address);
        event::emit_event(&mut events.journal_reclaimed_events, JournalReclaimedEvent {
            journal_id,
            owner: account_addr,
            amount_reclaimed: ADD_JOURNAL_FEE,
        });
    }

    // View functions
    #[view]
    public fun get_journal(platform_address: address, journal_id: u64): (u64, address, String, u64, u64, bool) acquires JournalPlatform {
        let platform = borrow_global<JournalPlatform>(platform_address);
        assert!(table::contains(&platform.journals, journal_id), E_JOURNAL_NOT_FOUND);
        
        let journal = table::borrow(&platform.journals, journal_id);
        (journal.id, journal.owner, journal.title, journal.total_reads, journal.total_earned, journal.is_active)
    }

    #[view]
    public fun get_journal_content(platform_address: address, journal_id: u64): String acquires JournalPlatform {
        let platform = borrow_global<JournalPlatform>(platform_address);
        assert!(table::contains(&platform.journals, journal_id), E_JOURNAL_NOT_FOUND);
        
        let journal = table::borrow(&platform.journals, journal_id);
        journal.content
    }

    #[view]
    public fun get_platform_stats(platform_address: address): (u64, u64) acquires JournalPlatform {
        let platform = borrow_global<JournalPlatform>(platform_address);
        (platform.journal_counter, platform.platform_balance)
    }

    #[view]
    public fun has_read_journal(reader_address: address, journal_id: u64): bool acquires ReadTracker {
        if (!exists<ReadTracker>(reader_address)) {
            return false
        };
        let read_tracker = borrow_global<ReadTracker>(reader_address);
        table::contains(&read_tracker.read_journals, journal_id)
    }
}
