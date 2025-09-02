import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import useAuth from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import PlayersPage from './pages/PlayersPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage'; 
import PositionsPage from './pages/PositionsPage';
import TechnicalDirectoryPage from './pages/TechnicalDirectoryPage';
import TechnicalDirectorDetailsPage from './pages/TechnicalDirectorDetailsPage'
import UsersPage from './pages/UsersPage';
import PrivateRoute from './components/PrivateRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppContent() {
  const { isSuspendedModalVisible, handleModalClose } = useAuth();

  return (
    <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/teams" element={<PrivateRoute><TeamsPage /></PrivateRoute>} />
          <Route path="/teams/:id" element={<PrivateRoute><TeamDetailsPage /></PrivateRoute>}  />
          <Route path="/players" element={<PrivateRoute><PlayersPage /></PrivateRoute>} />
          <Route path="/players/:id" element={<PrivateRoute><PlayerDetailsPage /></PrivateRoute>} />
          <Route path="/positions" element={<PrivateRoute><PositionsPage /></PrivateRoute>} />
          <Route path="/technical-directory" element={<PrivateRoute><TechnicalDirectoryPage /></PrivateRoute>} />
          <Route path="/technical-directory/:id" element={<PrivateRoute><TechnicalDirectorDetailsPage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
        </Routes>
        <SuspensionModal
        isVisible={isSuspendedModalVisible}
        onClose={handleModalClose}
      />
    </>
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