// src/App.js (Versión Corregida)

import React, { useState } from 'react'; // <-- Importamos 'useState'
import Map from './Map';            
import InformesForm from './InformesForm'; 
import AlertList from './AlertList';   
import ReportModal from './ReportModal'; // <-- 1. Importa el Modal

// Tus imports de CSS
import './App.css';                
import './AlertList.css';
import './ReportModal.css'; // <-- 2. Importa el CSS del Modal

function App() {
  // 3. Añade la "memoria" para el pin seleccionado
  const [selectedReport, setSelectedReport] = useState(null);

  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="App">
      <AlertList /> 
      
      {/* 4. Pasa la función de "clic" al Mapa */}
      <Map onPinClick={setSelectedReport} /> 
      
      <InformesForm /> 
      
      {/* 5. Renderiza el Modal (estará oculto) */}
      <ReportModal 
        isOpen={selectedReport !== null} 
        onClose={closeModal} 
        report={selectedReport} 
      />
    </div>
  );
}

export default App;