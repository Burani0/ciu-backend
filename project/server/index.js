
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import proxyRoutes from './routes/proxy.js';


// const examRoutes = require('./routes/exams');


dotenv.config();

const filename = fileURLToPath(import.meta.url);
const currentDirname = dirname(filename);

const app = express();
const httpServer = createServer(app);


app.use(cors());
// app.use(express.json());
app.use(express.json());

connectDB();



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api', proxyRoutes);
// app.use('/api/exams', examRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
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
  console.log(`Server running on port ${PORT}`);
});
