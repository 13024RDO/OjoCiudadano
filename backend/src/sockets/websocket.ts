import { Server } from 'ws';
import http from 'http';

export function setupWebSocket(server: http.Server): void {
  const wss = new Server({ server });

  wss.on('connection', (ws) => {
    console.log('Nuevo cliente WebSocket conectado');

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        // Aquí podrías manejar suscripciones si lo implementás
      } catch (e) {
        console.log('Mensaje WebSocket inválido');
      }
    });

    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado');
    });
  });

  (global as any).wss = wss;
}