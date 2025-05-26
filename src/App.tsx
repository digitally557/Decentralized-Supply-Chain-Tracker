import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
import Dashboard from './pages/Dashboard';
import ItemsPage from './pages/ItemsPage';
import ItemDetail from './pages/ItemDetail';
import RegisterItemPage from './pages/RegisterItemPage';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/register" element={<RegisterItemPage />} />
            <Route path="/scan" element={<ScanPage />} />
          </Routes>
        </Router>
      </ItemProvider>
    </AuthProvider>
  );
}

export default App;