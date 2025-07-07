import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
});

export const joinRoom = (roomId: string) => {
  socket.emit('join-room', roomId);
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