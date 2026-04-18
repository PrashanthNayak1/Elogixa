import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import JobBoard from './pages/JobBoard';
import Services from './pages/Services';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const AppLayout = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname === '/login' || pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-background text-primary">
        <Toaster position="top-right" />
        {!isAdminRoute && <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect Unknown Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <Chatbot />}
      </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;