// src/Map.js (Con TUS NUEVOS Íconos)

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from './supabaseClient';
import L from 'leaflet'; 

const centroTemuco = [-38.7359, -72.5904];

// -- ÍCONOS PERSONALIZADOS (Leyendo TUS archivos de /public) --

const fireIcon = L.icon({
  iconUrl: '/Fuego.gif', // <-- Tu GIF de fuego
  iconSize: [55, 55], // Un poco más grande para que se note
  iconAnchor: [20, 20], // La mitad del tamaño
  popupAnchor: [0, -20] // Arriba del centro
});

const landslideIcon = L.icon({
  iconUrl: '/Derrumbe.png', // <-- Tu PNG de derrumbe
  iconSize: [38, 38], // Tamaño estándar
  iconAnchor: [19, 19], // La mitad
  popupAnchor: [0, -19]
});

const floodIcon = L.icon({
  iconUrl: '/Inundacion.gif', // <-- Tu PNG de inundación
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});

const defaultIcon = L.icon({
  iconUrl: '/Otro.gif', // <-- Tu GIF de "Otro"
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});
// --------------------------------------------------

const getReportIcon = (reportType) => {
  switch (reportType) {
    case 'incendio':
      return fireIcon;
    case 'derrumba':
      return landslideIcon;
    case 'inundacion':
      return floodIcon;
    case 'otro':
      return defaultIcon;
    default:
      return defaultIcon; // Cualquier otra cosa usará el pin 'Otro.gif'
  }
};
// --------------------------------------------------


function Map() { 
  const [reports, setReports] = useState([]); 

  useEffect(() => {
    async function getReports() { 
      const { data, error } = await supabase
        .from('reports')    
        .select('*');     
      
      if (error) {
        console.error('Error cargando reports:', error.message);
      } else {
        setReports(data); 
      }
    }
    
    getReports(); 

    const subscription = supabase
      .channel('reports_channel') 
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' }, 
        (payload) => {
          setReports(currentReports => [...currentReports, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };

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
        >
          <Popup>
            <strong>{report.type}</strong><br />
            {report.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;