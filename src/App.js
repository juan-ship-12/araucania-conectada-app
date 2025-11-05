// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';     // Tu página del mapa
import AdminPanel from './AdminPanel'; // Tu panel secreto

// Importamos todos los CSS que usa HomePage
import './App.css';
import './AlertList.css';
import './ReportModal.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Principal: El mapa */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta Secreta: El panel de admin */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;