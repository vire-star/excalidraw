// src/socket/socket.controller.js - NAYA FILE
import jwt from 'jsonwebtoken';
import { Drawing } from '../models/drawing.model.js';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.js';
import { Server } from 'socket.io';
// const { Server } = await import('socket.io');

// Active drawings cache (performance ke liye)
const activeDrawings = new Map();

export const initSocket = (httpServer) => {
  
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // JWT Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      socket.userId = decoded.userId;
      
      // Fetch user data
      const user = await User.findById(decoded.userId).select('username color');
      if (!user) return next(new Error('User not found'));
      
      socket.userData = {
        userId: user._id.toString(),
        username: user.username,
        color: user.color
      };
      
      next();
    } catch (error) {
      console.log('Socket auth error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.userData.username} connected`);

    // 1. JOIN DRAWING ROOM
    socket.on('join-drawing', async ({ key }) => {
      try {
        const drawing = await Drawing.findOne({
          $or: [
            { _id:key, isPublic: true },
            { _id:key, ownerId: socket.userId }
          ]
        });

        if (!drawing) {
          return socket.emit('error', { message: 'Drawing not found or access denied' });
        }

        socket.join(key);
        socket.data.drawingKey = key;

        // Cache drawing in memory
        if (!activeDrawings.has(key)) {
          activeDrawings.set(key, {
            elements: drawing.elements,
            appState: drawing.appState,
            version: drawing.version
          });
        }

        const cachedDrawing = activeDrawings.get(key);

        // Send current state to joining user
        socket.emit('drawing-loaded', {
          key: drawing.key,
          title: drawing.title,
          elements: cachedDrawing.elements,
          appState: cachedDrawing.appState,
          version: cachedDrawing.version
        });

        // Notify others about new collaborator
        socket.to(key).emit('collaborator-joined', {
          socketId: socket.id,
          userId: socket.userData.userId,
          username: socket.userData.username,
          color: socket.userData.color
        });

        console.log(`👥 ${socket.userData.username} joined drawing: ${key}`);
      } catch (error) {
        console.log('Error joining drawing:', error);
        socket.emit('error', { message: 'Failed to join drawing' });
      }
    });

    // 2. CURSOR MOVEMENT
    socket.on('cursor-move', ({ x, y }) => {
      const key = socket.data.drawingKey;
      if (!key) return;

      socket.to(key).emit('collaborator-cursor', {
        socketId: socket.id,
        username: socket.userData.username,
        color: socket.userData.color,
        cursor: { x, y }
      });
    });

    // 3. ELEMENT ADDED
    socket.on('element-add', async ({ element }) => {
      const key = socket.data.drawingKey;
      if (!key) return;

      try {
        const cachedDrawing = activeDrawings.get(key);
        cachedDrawing.elements.push(element);
        cachedDrawing.version++;

        // Broadcast to all others
        socket.to(key).emit('element-add', {
          element,
          version: cachedDrawing.version
        });

        // Periodic DB save (every 10 operations)
        if (cachedDrawing.version % 10 === 0) {
          await Drawing.findOneAndUpdate(
            { key },
            {
              elements: cachedDrawing.elements,
              version: cachedDrawing.version
            }
          );
          console.log(`💾 Auto-saved drawing ${key} at version ${cachedDrawing.version}`);
        }
      } catch (error) {
        console.log('Error adding element:', error);
      }
    });

    // 4. ELEMENT UPDATED
    socket.on('element-update', async ({ elementId, changes }) => {
      const key = socket.data.drawingKey;
      if (!key) return;

      try {
        const cachedDrawing = activeDrawings.get(key);
        const index = cachedDrawing.elements.findIndex(el => el.id === elementId);

        if (index !== -1) {
          cachedDrawing.elements[index] = {
            ...cachedDrawing.elements[index],
            ...changes
          };
          cachedDrawing.version++;

          socket.to(key).emit('element-update', {
            elementId,
            changes,
            version: cachedDrawing.version
          });
        }
      } catch (error) {
        console.log('Error updating element:', error);
      }
    });

    // 5. ELEMENT DELETED
    socket.on('element-delete', async ({ elementId }) => {
      const key = socket.data.drawingKey;
      if (!key) return;

      try {
        const cachedDrawing = activeDrawings.get(key);
        cachedDrawing.elements = cachedDrawing.elements.filter(el => el.id !== elementId);
        cachedDrawing.version++;

        socket.to(key).emit('element-delete', {
          elementId,
          version: cachedDrawing.version
        });
      } catch (error) {
        console.log('Error deleting element:', error);
      }
    });

    // 6. APPSTATE UPDATED (zoom, scroll, etc)
    socket.on('appstate-update', ({ appState }) => {
      const key = socket.data.drawingKey;
      if (!key) return;

      const cachedDrawing = activeDrawings.get(key);
      cachedDrawing.appState = { ...cachedDrawing.appState, ...appState };

      socket.to(key).emit('appstate-update', { appState });
    });

    // 7. DISCONNECT
    socket.on('disconnect', async () => {
      const key = socket.data.drawingKey;
      
      if (key) {
        // Notify others
        io.to(key).emit('collaborator-left', {
          socketId: socket.id,
          username: socket.userData.username
        });

        // Save to DB on disconnect
        const cachedDrawing = activeDrawings.get(key);
        if (cachedDrawing) {
          await Drawing.findOneAndUpdate(
            { key },
            {
              elements: cachedDrawing.elements,
              appState: cachedDrawing.appState,
              version: cachedDrawing.version
            }
          );
          console.log(`💾 Saved drawing ${key} on disconnect`);
        }

        console.log(`❌ ${socket.userData.username} left drawing: ${key}`);
      }
    });
  });

  return io;
};
