// src/App.jsx
import React from 'react';
import Header from './components/Header';
import Nav from './components/Nav';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Nav />
      {/* Aquí va el contenido principal de tu app */}
      <main className="p-4">
        <h2 className="text-lg font-semibold">Bienvenido a la plataforma</h2>
        <p>Selecciona una opción del menú para comenzar.</p>
      </main>
    </div>
  );
}

export default App;