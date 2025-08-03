import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import PlayersPage from './pages/PlayersPage';
import PositionsPage from './pages/PositionsPage';
import TechnicalDirectoryPage from './pages/TechnicalDirectoryPage';
// import UsersPage from './pages/UsersPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute>
            <HomePage />
          </PrivateRoute>} />
          <Route path="/teams" element={<PrivateRoute>
            <TeamsPage />
          </PrivateRoute>} />
          <Route path="/players" element={<PrivateRoute>
            <PlayersPage />
          </PrivateRoute>} />
          <Route path="/positions" element={<PrivateRoute>
            <PositionsPage />
          </PrivateRoute>} />
          <Route path="/technical-directory" element={<PrivateRoute>
            <TechnicalDirectoryPage />
          </PrivateRoute>} />
          <Route path="/teams/:id" element={<PrivateRoute><TeamDetailsPage /></PrivateRoute>}  />
          {/* <Route path="/users" element={<PrivateRoute>
            <UsersPage />
          </PrivateRoute>} /> */}
        </Routes>
    </AuthProvider>
  );
}

export default App;