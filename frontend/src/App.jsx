import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';
import Contacts from './pages/Contacts';
import Segments from './pages/Segments';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

import Layout from './components/Layout/Layout'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>

              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/campaigns/create" element={<CreateCampaign />} />
              <Route path="/campaigns/edit/:id" element={<EditCampaign />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/segments" element={<Segments />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />

            </Route>
          </Route>
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;