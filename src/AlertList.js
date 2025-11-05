import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function AlertList() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function getInitialAlerts() {
      const { data, error } = await supabase
        .from('alerts') // <--- CORREGIDO (de 'alertas' a 'alerts')
        .select('*')
        .order('created_at', { ascending: false }); 

      if (error) {
        console.error('Error cargando alertas iniciales:', error.message);
      } else {
        setAlerts(data);
      }
    }
    
    getInitialAlerts();

    const subscription = supabase
      .channel('alerts_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' }, // <--- CORREGIDO
        (payload) => {
          console.log('¡Nueva alerta recibida!', payload.new);
          setAlerts(currentAlerts => [payload.new, ...currentAlerts]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []); 

  if (alerts.length === 0) {
    return (
      <div className="alert-list">
        <h4>Alertas Oficiales</h4>
        <div className="alert-item">
          <p>No hay alertas activas por el momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alert-list">
      <h4>Alertas Oficiales</h4>
      {alerts.map(alert => (
        // --- CORREGIDO AQUÍ ABAJO ---
        <div key={alert.id} className={`alert-item severity-${alert.severity}`}>
          <strong>{alert.title}</strong>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
}

export default AlertList;