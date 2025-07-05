import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
});

export const joinRoom = (roomId: string, userType: 'streamer' | 'viewer', streamerId?: string) => {
  socket.emit('join-room', { roomId, userType, streamerId });
};

export const leaveRoom = () => {
  socket.emit('leave-room');
};

export const emitStream = (data: any) => {
  socket.emit('stream-video', data);
};

export const onStream = (callback: (data: any) => void) => {
  socket.on('receive-stream', callback);
};

export const onRoomUpdate = (callback: (data: any) => void) => {
  socket.on('room-update', callback);
};