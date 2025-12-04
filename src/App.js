// Location: admin-panel/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import CoinRequests from './pages/CoinRequests';
import Games from './pages/Games';
import CreateGame from './pages/CreateGame';
import GameDetail from './pages/GameDetail';
import DeclareResult from './pages/DeclareResult';
import WithdrawalRequests from './pages/WithdrawalRequests';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
          <Route path="/coin-requests" element={<ProtectedRoute><CoinRequests /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
          <Route path="/games/create" element={<ProtectedRoute><CreateGame /></ProtectedRoute>} />
          <Route path="/games/:id" element={<ProtectedRoute><GameDetail /></ProtectedRoute>} />
          
          {/* NEW: Separate routes for Open and Close declaration */}
          <Route path="/games/:id/declare-open" element={<ProtectedRoute><DeclareResult type="open" /></ProtectedRoute>} />
          <Route path="/games/:id/declare-close" element={<ProtectedRoute><DeclareResult type="close" /></ProtectedRoute>} />
          
          <Route path="/withdrawal-requests" element={<ProtectedRoute><WithdrawalRequests /></ProtectedRoute>} />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;