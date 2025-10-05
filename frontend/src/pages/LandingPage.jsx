import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Wallet, Shield, Zap, TrendingUp, Lock } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Decentralized Journals',
      description: 'Write and store your journals on the Aptos blockchain permanently'
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Petra Wallet Integration',
      description: 'Seamlessly connect with your Petra wallet for secure transactions'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Pay to Read & Write',
      description: 'Earn APT when others read your journals, pay a small fee to add entries'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Earn While You Share',
      description: 'Get paid when others unlock and read your journal entries'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Reclaim Your Investment',
      description: 'Deactivate journals and reclaim your initial posting fee anytime'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Transaction History',
      description: 'View all your transactions on Aptos Explorer with full transparency'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-primary-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <BookOpen className="w-20 h-20 text-primary-500 mx-auto" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Aptos Journal</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-dark-300 mb-8 max-w-3xl mx-auto">
              The first decentralized journal platform on Aptos blockchain.
              Write, earn, and own your stories forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Aptos Journal?</span>
            </h2>
            <p className="text-xl text-dark-300">
              Experience the future of journaling on blockchain
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card"
              >
                <div className="text-primary-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-dark-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Connect Wallet', desc: 'Link your Petra wallet' },
              { step: '02', title: 'Create Journal', desc: 'Pay 0.1 APT to add entry' },
              { step: '03', title: 'Earn APT', desc: 'Get 0.05 APT per read' },
              { step: '04', title: 'Reclaim Anytime', desc: 'Get your fee back' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-primary-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-dark-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/30 to-primary-800/30">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your <span className="gradient-text">Journey?</span>
            </h2>
            <p className="text-xl text-dark-300 mb-8">
              Join the decentralized journaling revolution today
            </p>
            <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-block">
              Create Your Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-dark-400">
          <p>© 2025 Aptos Journal. Built on Aptos Blockchain.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
