import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';


import mongoose from 'mongoose';
import dotenv from 'dotenv';
 
import examRoutes from './routes/examRoutes.js'; 
import uploadRoutes from './routes/uploadRoutes.js';
import lecturerUploadRoutes from './routes/lecturerUploadRoutes.js';

 
import lecturerRoutes from './routes/lecturerRoutes.js';
import proxyRoutes from './routes/proxy.js';
 

import { connectDB } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import morgan from 'morgan';





const filename = fileURLToPath(import.meta.url);
const currentDirname = dirname(filename);

// Initialize Express app
const app = express();
app.use(express.json());
const httpServer = createServer(app);

app.use(express.json());
connectDB();

app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));





// Enable CORS for the frontend origin
app.use(cors({
  origin: function (origin, callback) {
    console.log('Incoming origin:', origin);
    const allowedOrigins = [
      'http://localhost:5173',
      // 'https://ciu-backend-huhl-git-deployment-buranis-projects.vercel.app',
      // 'https://ciu-backend-1.onrender.com',
      // 'https://ciu-backend.onrender.com',
      // 'https://ciu-backend-huhl.vercel.app',
      'https://examiner.ciu.ac.ug',
    //   'https://ciu-backend-buranis-projects.vercel.app',
    //    'https://ciu-backend.vercel.app',
    // 'https://4306572b40b9.ngrok-free.app',
    //   'http://81.199.139.112'

    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
app.use('/api/admin/uploads', uploadRoutes);
app.use('/api/lecturer/uploads', lecturerUploadRoutes);

 

const io = new Server(httpServer, {
  cors: {
    origin: "https://examiner.ciu.ac.ug",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});





const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    try {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { viewers: new Set(), streamers: new Set() });
      }
      const room = rooms.get(roomId);

      const isStreamer = socket.handshake.headers.referer?.includes('/exam/');
      if (isStreamer) {
        room.streamers.add(socket.id);
        console.log(`Streamer ${socket.id} joined room ${roomId}`);
      } else {
        room.viewers.add(socket.id);
        console.log(`Viewer ${socket.id} joined room ${roomId}`);
      }

      io.to(roomId).emit('room-update', {
        viewerCount: room.viewers.size,
        streamerCount: room.streamers.size
      });
    } catch (error) {
      console.error('Error in join-room:', error);
    }
  });

  socket.on('stream-video', (data) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      if (roomId) {
        console.log(`Broadcasting stream from ${socket.id} to room ${roomId}. Data size: ${data.length}`);
        // Include the streamer's socket ID with the stream data
        socket.to(roomId).emit('receive-stream', {
          streamerId: socket.id,
          data: data
        });
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
          if (room.streamers.has(socket.id)) {
            room.streamers.delete(socket.id);
            console.log(`Streamer ${socket.id} left room ${roomId}`);
          } else {
            room.viewers.delete(socket.id);
            console.log(`Viewer ${socket.id} left room ${roomId}`);
          }
          io.to(roomId).emit('room-update', {
            viewerCount: room.viewers.size,
            streamerCount: room.streamers.size
          });
        }
      }
    } catch (error) {
      console.error('Error in leave-room:', error);
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.streamers.has(socket.id)) {
        room.streamers.delete(socket.id);
        console.log(`Streamer ${socket.id} disconnected from room ${roomId}`);
      } else {
        room.viewers.delete(socket.id);
      }
      io.to(roomId).emit('room-update', {
        viewerCount: room.viewers.size,
        streamerCount: room.streamers.size
      });
    });
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});