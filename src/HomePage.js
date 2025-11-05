import React, { useState } from 'react'; // <-- 1. Volvemos a importar useState

// Componentes
import Map from './Map';            
import InformesForm from './InformesForm'; 
import AlertList from './AlertList';   
import ReportModal from './ReportModal'; // <-- 2. Volvemos a importar el modal de reportes

// CSS
import './App.css';                
import './AlertList.css'; 
import './ReportModal.css'; // <-- 3. Volvemos a importar el CSS del modal

function HomePage() {
  // 4. Volvemos a añadir el estado para el pin seleccionado
  const [selectedReport, setSelectedReport] = useState(null);

  // 5. Función para cerrar el modal
  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="App">
      <AlertList /> 
      
      {/* 6. Le volvemos a pasar la función al Mapa */}
      <Map onPinClick={setSelectedReport} /> 
      
      <InformesForm /> 

      {/* 7. Volvemos a poner el Modal */}
      <ReportModal 
        isOpen={selectedReport !== null} 
        onClose={closeModal} 
        report={selectedReport} 
      />
    </div>
  );
}

export default HomePage;