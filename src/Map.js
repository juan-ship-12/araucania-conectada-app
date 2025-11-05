// src/Map.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from './supabaseClient'; 

const centroTemuco = [-38.7359, -72.5904];

// 1. ACEPTAMOS LA NUEVA PROP 'onPinClick' QUE VIENE DE App.js
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
          // 2. AÑADIMOS EL MANEJADOR DE EVENTO
          eventHandlers={{
            click: () => {
              onPinClick(report); // 3. Al hacer clic, llamamos a la función con los datos del reporte
            },
          }}
        >
          {/* 4. Mantenemos el Popup por si acaso, pero el modal es el principal */}
          <Popup>
            <strong>{report.type}</strong><br />
            Haz clic para ver detalles.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;