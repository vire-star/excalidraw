// src/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../Store/UserStore';
import { useDrawingStore } from '../Store/DrawingStore';
import { useGetUserHook } from './user.hook';

export const useSocket = (drawingKey?: string) => {
  const socketRef = useRef<Socket | null>(null);

  // const token = useAuthStore((state) => state.token);
  const {data} = useGetUserHook()
  const token= data?.token
  const { 
    addElement, 
    updateElement, 
    deleteElement, 
    setElements,
    updateAppState,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorCursor
  } = useDrawingStore();


  useEffect(() => {
    if (!token) return;

    const socket = io('http://localhost:3000', {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      
      if (drawingKey) {
        socket.emit('join-drawing', { key: drawingKey });
      }
    });

    socket.on('drawing-loaded', ({ elements, appState, version }) => {
      console.log('📥 Drawing loaded');
      setElements(elements);
      updateAppState(appState);
    });

    socket.on('collaborator-joined', (collaborator) => {
      console.log('👥 Collaborator joined:', collaborator.username);
      addCollaborator(collaborator);
    });

    socket.on('collaborator-left', ({ socketId, username }) => {
      console.log('👋 Collaborator left:', username);
      removeCollaborator(socketId);
    });

    socket.on('collaborator-cursor', ({ socketId, cursor, color }) => {
      updateCollaboratorCursor(socketId, cursor);
    });

    socket.on('element-add', ({ element }) => {
      addElement(element);
    });

    socket.on('element-update', ({ elementId, changes }) => {
      updateElement(elementId, changes);
    });

    socket.on('element-delete', ({ elementId }) => {
      deleteElement(elementId);
    });

    socket.on('appstate-update', ({ appState }) => {
      updateAppState(appState);
    });

    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, drawingKey]);

  return socketRef.current;
};
