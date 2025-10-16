import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/db";
import incidentRoutes from "./routes/incidents";
import statsRoutes from "./routes/stat";
import operacionesRoutes from "./routes/operaciones";
import { setupWebSocket } from "./sockets/websocket";

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);

// Conexión a DB
connectDB();

// Rutas
app.use("/api/incidents", incidentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/operaciones", operacionesRoutes);

// WebSocket
setupWebSocket(server);
// Simulación de estados de móviles cada 2 minutos
setInterval(() => {
  const moviles = (global as any).movilesEnTiempoReal as any[];
  if (!moviles) return;

  let huboCambio = false;
  moviles.forEach((movil: any) => {
    if (movil.estado === "en_camino") {
      movil.estado = "en_lugar";
      huboCambio = true;
    } else if (movil.estado === "en_lugar") {
      movil.estado = "disponible";
      huboCambio = true;
    }
  });

  if (huboCambio && (global as any).wss) {
    (global as any).wss.clients.forEach((client: any) => {
      if (client.readyState === client.OPEN) {
        client.send(
          JSON.stringify({
            type: "moviles_update",
            payload: moviles,
          })
        );
      }
    });
  }
}, 120000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
