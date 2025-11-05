// src/Map.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from './supabaseClient'; 

const centroTemuco = [-38.7359, -72.5904];

// 1. Volvemos a aceptar 'onPinClick' como prop
function Map({ onPinClick }) { 
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
          // 2. Volvemos a añadir el manejador de clic
          eventHandlers={{
            click: () => {
              onPinClick(report); // Llama a la función en App.js
            },
          }}
        >
          {/* 3. El Popup sigue ahí (es la ventanita chica) */}
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