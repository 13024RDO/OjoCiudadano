import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/db";
import incidentRoutes from "./routes/incidents";
import statsRoutes from "./routes/stat";
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

// WebSocket
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
