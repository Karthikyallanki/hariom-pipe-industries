import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: [config.corsOrigin, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logger.info(`[Socket.IO Client Connected] ID: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`[Socket.IO Client Disconnected] ID: ${socket.id}`);
  });
});

const startServer = async () => {
  await connectDB();

  server.listen(config.port, () => {
    logger.info(`[Hariom Pipes Enterprise Backend Server Running] Port: ${config.port} | Env: ${config.nodeEnv}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { server };
