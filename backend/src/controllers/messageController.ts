import { Request, Response } from 'express';
import prisma from '../config/database';
import logger from '../config/logger';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { otherUserId } = req.query;

    if (!otherUserId) {
      res.status(400).json({ error: 'otherUserId is required' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: otherUserId as string },
          { senderId: otherUserId as string, receiverId: req.user.userId },
        ],
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
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ messages });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get all unique conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.userId },
          { receiverId: req.user.userId },
        ],
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
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by conversation partner
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.senderId === req.user!.userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === req.user!.userId ? msg.receiver : msg.sender;
      
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          userId: partnerId,
          user: partner,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      
      // Count unread messages
      if (msg.receiverId === req.user!.userId && !msg.isRead) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({ conversations });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const markMessagesAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { otherUserId } = req.body;

    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: req.user.userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    logger.error('Mark messages as read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};
