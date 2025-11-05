import React, { useState } from 'react'; // <-- 1. IMPORTAR useState

// Tus otros imports
import Map from './Map';            
import InformesForm from './InformesForm'; 
import AlertList from './AlertList';   
import ReportModal from './ReportModal'; // <-- 2. IMPORTAR EL MODAL

// Tus imports de CSS
import './App.css';                
import './InformesForm.css'; // (Este es el tuyo, 'InformesForm.css')
import './AlertList.css';         
import './ReportModal.css'; // <-- 3. IMPORTAR CSS DEL MODAL

function App() {
  // 4. ESTADO PARA SABER QUÉ REPORTE ESTÁ SELECCIONADO
  const [selectedReport, setSelectedReport] = useState(null);

  // 5. Función para cerrar el modal
  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="App">
      <AlertList /> 

      {/* 6. LE PASAMOS LA FUNCIÓN AL MAPA */}
      <Map onPinClick={setSelectedReport} /> 

      <InformesForm /> 

      {/* 7. MOSTRAMOS EL MODAL SI HAY UN REPORTE SELECCIONADO */}
      <ReportModal 
        isOpen={selectedReport !== null} 
        onClose={closeModal} 
        report={selectedReport} 
      />
    </div>
  );
}

export default App;