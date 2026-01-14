import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AddJournal from './pages/AddJournal';
import MyJournals from './pages/MyJournals';
import ExploreJournals from './pages/ExploreJournals';
import TransactionHistory from './pages/TransactionHistory';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative z-10">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-journal" element={<ProtectedRoute><AddJournal /></ProtectedRoute>} />
        <Route path="/my-journals" element={<ProtectedRoute><MyJournals /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExploreJournals /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
