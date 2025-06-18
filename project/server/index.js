import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
 
import examRoutes from './routes/examRoutes.js'; 

 
import lecturerRoutes from './routes/lecturerRoutes.js';
import proxyRoutes from './routes/proxy.js';
 

import { connectDB } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const filename = fileURLToPath(import.meta.url);
const currentDirname = dirname(filename);

// Initialize Express app
const app = express();
app.use(express.json());
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());
connectDB();


// Enable CORS for the frontend origin
app.use(cors({
  origin: ['http://localhost:5173', 'https://ciu-backend-1.onrender.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create HTTP server and integrate with Socket.IO
// const httpServer = createServer(app);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
 
app.use('/api/lecturer', lecturerRoutes);
app.use('/api', proxyRoutes);
app.use('/api/exams', examRoutes);
 

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", 'https://ciu-backend-1.onrender.com'],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    try {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { viewers: new Set(), streamer: null });
      }
      const room = rooms.get(roomId);

      const isStreamer = socket.handshake.headers.referer?.includes('/stream/');
      if (isStreamer) {
        room.streamer = socket.id;
      } else {
        room.viewers.add(socket.id);
      }

      io.to(roomId).emit('room-update', {
        viewerCount: room.viewers.size,
        hasStreamer: !!room.streamer
      });
    } catch (error) {
      console.error('Error in join-room:', error);
    }
  });

  socket.on('stream-video', (data) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      if (roomId) {
        console.log(`Broadcasting stream to room ${roomId}. Data size: ${data.length}`);
        socket.to(roomId).emit('receive-stream', data);
      }
    } catch (error) {
      console.error('Error in stream-video:', error);
    }
  });

  socket.on('leave-room', () => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          if (room.streamer === socket.id) {
            room.streamer = null;
          } else {
            room.viewers.delete(socket.id);
          }
          io.to(roomId).emit('room-update', {
            viewerCount: room.viewers.size,
            hasStreamer: !!room.streamer
          });
        }
      }
    } catch (error) {
      console.error('Error in leave-room:', error);
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.streamer === socket.id) {
        room.streamer = null;
      } else {
        room.viewers.delete(socket.id);
      }
      io.to(roomId).emit('room-update', {
        viewerCount: room.viewers.size,
        hasStreamer: !!room.streamer
      });
    });
    console.log('User disconnected:', socket.id);
  });
});

 
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
