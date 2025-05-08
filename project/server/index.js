
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const filename = fileURLToPath(import.meta.url);
const currentDirname = dirname(filename);

const app = express();
const httpServer = createServer(app);

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

httpServer.listen(3001, () => {
  console.log('Server running on port 3001');
});
