import React from 'react'; 

// Tus componentes
import Map from './Map';            
import InformesForm from './InformesForm'; // (El tuyo se llama así, ¡está bien!)
import AlertList from './AlertList';   

// Tus imports de CSS
import './App.css'; 
import './AlertList.css';               

function App() {

  return (
    <div className="App">
      {/* El 'manager' de las notificaciones pop-up */}
       
      {/* Componente 'fantasma' que escucha las alertas */}
      <AlertList /> 
      
      {/* El Mapa (sin lógica extra) */}
      <Map /> 
      
      {/* El botón flotante '+' que abre su propio modal */}
      <InformesForm /> 
    </div>
  );
}

export default App;