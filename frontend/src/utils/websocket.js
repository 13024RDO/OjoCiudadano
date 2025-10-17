let ws = null;

export const connectWebSocket = (onMessage) => {
  ws = new WebSocket("ws://localhost:3000");
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    onMessage(msg);
  };
  ws.onopen = () => console.log("WebSocket conectado");
  ws.onclose = () => console.log("WebSocket desconectado");
};

export const closeWebSocket = () => {
  if (ws) ws.close();
};
