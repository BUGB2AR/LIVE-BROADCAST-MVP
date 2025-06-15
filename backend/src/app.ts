import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initializeTypeORM } from './shared/infra/persistence/typeorm';
import { routes } from './routes';
import { errorHandlingMiddleware } from './shared/infra/http/middlewares/errorHandling';

export const app = express();
export const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorHandlingMiddleware); 

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  //chat
  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', (data: { roomId: string; message: string; userId: string; username: string }) => {
    io.to(data.roomId).emit('receiveMessage', data);
  });

  // mimos
  socket.on('sendMimic', (data: { roomId: string; userId: string; username: string; amount: number; message?: string }) => {
    io.to(data.roomId).emit('receiveMimic', data);

  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

initializeTypeORM();