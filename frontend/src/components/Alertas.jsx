import React from 'react';

function AlertSystem() {
  // Datos simulados
  const highPriorityAlerts = [
    {
      id: 1,
      type: 'Robo',
      description: 'Robo a transeúnte en la calle',
      location: 'Centro Histórico, CDMX',
      timeAgo: 'Hace 8h',
      severity: 'alta',
    },
    {
      id: 2,
      type: 'Asalto',
      description: 'Asalto a mano armada en comercio',
      location: '',
      timeAgo: 'Hace 11h',
      severity: 'crítica',
    },
  ];

  const recentActivity = [
    { type: 'Robo', location: 'Centro Histórico, CDMX', timeAgo: 'Hace 8h', severity: 'alta' },
    { type: 'Asalto', location: 'Colonia Roma Norte', timeAgo: 'Hace 11h', severity: 'crítica' },
    { type: 'Vandalismo', location: 'Colonia Condesa', timeAgo: 'Hace 18h', severity: 'baja' },
    { type: 'Accidente', location: 'Av. Reforma', timeAgo: 'Hace 7h', severity: 'media' },
  ];

  const stats = [
    { title: 'Alertas Críticas', count: 2, subtitle: 'Requieren atención inmediata', color: '#ff0066' }, // Rosa neón
    { title: 'Alta Prioridad', count: 3, subtitle: 'Monitoreo activo recomendado', color: '#ffff00' }, // Amarillo neón
    { title: 'Últimas 24h', count: 8, subtitle: 'Incidentes reportados hoy', color: '#00ff88' }, // Verde neón
  ];

  // Estilos por severidad — colores neón altamente visibles sobre negro
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'baja':
        return {
          backgroundColor: 'rgba(0, 255, 136, 0.2)',
          color: '#00ff88',
          borderColor: '#00ff88',
          fontWeight: 'bold',
          boxShadow: '0 0 10px #00ff88',
          borderWidth: '2px',
          fontSize: '1rem',
          padding: '10px 16px',
          borderRadius: '16px',
          textAlign: 'center',
          display: 'inline-block'
        };
      case 'media':
        return {
          backgroundColor: 'rgba(255, 255, 0, 0.2)',
          color: '#ffff00',
          borderColor: '#ffff00',
          fontWeight: 'bold',
          boxShadow: '0 0 10px #ffff00',
          borderWidth: '2px',
          fontSize: '1rem',
          padding: '10px 16px',
          borderRadius: '16px',
          textAlign: 'center',
          display: 'inline-block'
        };
      case 'alta':
        return {
          backgroundColor: 'rgba(255, 255, 0, 0.3)',
          color: '#ffff00',
          borderColor: '#ffff00',
          fontWeight: 'bold',
          boxShadow: '0 0 12px #ffff00',
          borderWidth: '2px',
          fontSize: '1rem',
          padding: '10px 16px',
          borderRadius: '16px',
          textAlign: 'center',
          display: 'inline-block'
        };
      case 'crítica':
        return {
          backgroundColor: 'red',
          color: 'black',
          borderColor: '#ff0066',
          fontWeight: 'bold',
          boxShadow: '0 0 15px #ff0066, 0 0 25px #ff0066 inset',
          borderWidth: '2px',
          fontSize: '1rem',
          padding: '10px 16px',
          borderRadius: '16px',
          textAlign: 'center',
          display: 'inline-block',
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        };
      default:
        return {
          backgroundColor: 'rgba(100, 100, 100, 0.1)',
          color: '#cccccc',
          borderColor: '#666666',
          borderWidth: '2px',
          fontSize: '1rem',
          padding: '10px 16px',
          borderRadius: '16px',
          textAlign: 'center',
          display: 'inline-block'
        };
    }
  };

  return (
    <div className="bg-black text-white min-h-screen w-[95%] md:w-[75%] lg:w-[50%] xl:w-[45%] p-5">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00ff88">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.919V9h1.071C14.07 10.282 15 11.982 15 14v3z" />
            </svg>
            Sistema de Alertas
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>Recibe notificaciones sobre incidentes de alta prioridad</p>
        </div>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#00ff88',
            border: '2px solid #00ff88',
            borderRadius: '8px',
            color: '#000000',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 12px #00ff88',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => e.target.style.boxShadow = '0 0 18px #00ff88, 0 0 30px #00ff88'}
          onMouseLeave={(e) => e.target.style.boxShadow = '0 0 12px #00ff88'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#000000" style={{ marginRight: '8px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Activar
        </button>
      </div>

      {/* Notificación general */}
      <div style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#111111',
        border: '1px solid #00ff88',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00ff88">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 17h.01M12 12h.01M12 12v.01M12 12h.01V12z" />
        </svg>
        <p style={{ fontSize: '0.9rem', color: '#dddddd' }}>
          Activa las notificaciones para recibir alertas en tiempo real sobre incidentes críticos en tu área.
        </p>
      </div>

      {/* Alertas de Alta Prioridad */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '0.9rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px',
          color: '#ffffff'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#ff0066">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 17h.01M12 12h.01M12 12v.01M12 12h.01V12z" />
          </svg>
          Alertas de Alta Prioridad ({highPriorityAlerts.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {highPriorityAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: '12px',
                backgroundColor: '#111111',
                border: '1px solid #333333',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                transition: 'border 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.border = `1px solid ${getSeverityStyle(alert.severity).borderColor}`}
              onMouseLeave={(e) => e.currentTarget.style.border = '1px solid #333333'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={getSeverityStyle(alert.severity).color}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 17h.01M12 12h.01M12 12v.01M12 12h.01V12z" />
                </svg>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1rem', margin: '0 0 4px 0' }}>{alert.type}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#bbbbbb', margin: '0 0 4px 0' }}>{alert.description}</p>
                  {alert.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#888888' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#888888">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.244-4.244a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {alert.location}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    ...getSeverityStyle(alert.severity),
                    display: 'inline-block' // Asegura que el estilo se aplique correctamente
                  }}
                >
                  {alert.severity}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>{alert.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '0.9rem',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#ffffff'
        }}>
          Actividad Reciente (24h)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentActivity.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                backgroundColor: '#111111',
                border: '1px solid #333333',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1rem', margin: '0 0 4px 0' }}>{item.type}</h3>
                <p style={{ fontSize: '0.85rem', color: '#bbbbbb' }}>{item.location}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    ...getSeverityStyle(item.severity),
                    display: 'inline-block'
                  }}
                >
                  {item.severity}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              padding: '16px',
              backgroundColor: '#111111',
              border: '1px solid #333333',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#aaaaaa', margin: '0 0 8px 0' }}>{stat.title}</h3>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              color: stat.color,
              textShadow: `0 0 8px ${stat.color}`
            }}>
              {stat.count}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#888888' }}>{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#555555',
        paddingTop: '20px',
        borderTop: '1px solid #333333',
        marginTop: '20px'
      }}>
        Plataforma de Seguridad Ciudadana - Empoderando a la comunidad con información en tiempo real
      </div>

      {/* Animación pulsante para alertas críticas */}
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 15px #ff0066, 0 0 25px #ff0066 inset; }
          50% { box-shadow: 0 0 25px #ff0066, 0 0 35px #ff0066 inset; }
          100% { box-shadow: 0 0 15px #ff0066, 0 0 25px #ff0066 inset; }
        }
      `}</style>
    </div>
  );
}

export default AlertSystem;