import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import EditItem from './pages/items/EditItem';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Transactions from './pages/Transactions';
import Offers from './pages/Offers';
import NotFound from './pages/NotFound';
import ItemList from './pages/items/ItemList';
import ItemDetails from './pages/items/ItemDetails';

type RouteProps = {
  children: React.ReactNode;
};
// Protected Route Component
const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Items Routes - Public browsing */}
            <Route 
              path="/items" 
              element={<ItemList />} 
            />
            <Route 
              path="/items/:id" 
              element={<ItemDetails />} 
            />

            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Item Management Routes - Protected */}
            <Route 
              path="/items/create" 
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/items/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/my-items" 
              element={
                <ProtectedRoute>
                  <ItemList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/offers" 
              element={
                <ProtectedRoute>
                  <Offers />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
      </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
