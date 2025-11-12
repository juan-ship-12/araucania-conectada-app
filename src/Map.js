// src/Map.js (Con Íconos y Lógica Corregida)

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from './supabaseClient';
import L from 'leaflet'; 

const centroTemuco = [-38.7359, -72.5904];

// -- ÍCONOS --
const fireIcon = L.icon({
  iconUrl: '/Fuego.gif', 
  iconSize: [50, 50], 
  iconAnchor: [22, 22], 
  popupAnchor: [0, -22] 
});

const landslideIcon = L.icon({
  iconUrl: '/Derrumbe.png', 
  iconSize: [36, 36], 
  iconAnchor: [19, 19], 
  popupAnchor: [0, -19]
});

const floodIcon = L.icon({
  iconUrl: '/Inundacion.gif', 
  iconSize: [35, 36],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});

const defaultIcon = L.icon({
  iconUrl: '/Otro.gif', 
  iconSize: [36, 36],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});
// -----------------

const getReportIcon = (reportType) => {
  switch (reportType) {
    case 'incendio':
      return fireIcon;
    case 'derrumbe': 
      return landslideIcon;
    case 'inundacion':
      return floodIcon;
    case 'otro':
      return defaultIcon;
    default:
      return defaultIcon;
  }
};
// -----------------

function Map({ onPinClick }) { 
  const [reports, setReports] = useState([]); 

  useEffect(() => {
    async function getReports() { 
      const { data, error } = await supabase.from('reports').select('*');     
      if (error) { console.error('Error cargando reports:', error.message); } 
      else { setReports(data); }
    }
    getReports(); 

    const subscription = supabase
      .channel('reports_channel') 
      .on( 'postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, 
        (payload) => { setReports(currentReports => [...currentReports, payload.new]); }
      )
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, []); 

  return (
    <MapContainer center={centroTemuco} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {reports.map(report => ( 
        <Marker 
          key={report.id} 
          position={[report.lat, report.lon]}
          icon={getReportIcon(report.type)} 
          
          eventHandlers={{
            click: () => {
              onPinClick(report); // Le avisa a App.js
            },
          }}
        >
          <Popup>
            <strong style={{ textTransform: 'capitalize' }}>{report.type}</strong><br />
            Clic para ver detalles
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;