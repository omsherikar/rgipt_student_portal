import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import logger from '../config/logger';

interface SocketUser {
  userId: string;
  email: string;
  role: string;
}

const userSockets = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SocketUser;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user as SocketUser;
    logger.info(`User connected: ${user.email} (${socket.id})`);

    // Store socket connection
    userSockets.set(user.userId, socket.id);

    // Join user to their personal room
    socket.join(user.userId);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, type = 'TEXT', fileUrl } = data;

        // Create message in database
        const message = await prisma.message.create({
          data: {
            senderId: user.userId,
            receiverId,
            content,
            type,
            fileUrl,
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                student: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
                faculty: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            receiver: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        });

        // Send to receiver if online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', message);
        }

        // Confirm to sender
        socket.emit('message_sent', message);

        // Create notification for receiver
        await prisma.notification.create({
          data: {
            userId: receiverId,
            title: 'New Message',
            message: `You have a new message from ${user.email}`,
            type: 'INFO',
          },
        });

        // Send notification to receiver
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_notification', {
            title: 'New Message',
            message: `You have a new message from ${user.email}`,
          });
        }

        logger.info(`Message sent from ${user.userId} to ${receiverId}`);
      } catch (error) {
        logger.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId: user.userId,
          email: user.email,
        });
      }
    });

    // Handle stop typing
    socket.on('stop_typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', {
          userId: user.userId,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${user.email} (${socket.id})`);
      userSockets.delete(user.userId);
    });
  });

  return io;
};

export const sendNotification = (io: SocketIOServer, userId: string, notification: any): void => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit('new_notification', notification);
  }
};
