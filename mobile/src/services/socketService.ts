import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';
import * as SecureStore from 'expo-secure-store';

class SocketService {
  private socket: Socket | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];
  private notificationCallbacks: ((notification: any) => void)[] = [];

  async connect() {
    const token = await SecureStore.getItemAsync('authToken');
    
    if (!token) {
      console.error('No auth token found');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('new_message', (message) => {
      console.log('New message received:', message);
      this.messageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);
      this.notificationCallbacks.forEach(callback => callback(notification));
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(receiverId: string, content: string, type: string = 'TEXT', fileUrl?: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('send_message', {
      receiverId,
      content,
      type,
      fileUrl,
    });
  }

  sendTypingIndicator(receiverId: string) {
    if (!this.socket) return;
    this.socket.emit('typing', { receiverId });
  }

  sendStopTypingIndicator(receiverId: string) {
    if (!this.socket) return;
    this.socket.emit('stop_typing', { receiverId });
  }

  onNewMessage(callback: (message: any) => void) {
    this.messageCallbacks.push(callback);
  }

  onNewNotification(callback: (notification: any) => void) {
    this.notificationCallbacks.push(callback);
  }

  removeMessageCallback(callback: (message: any) => void) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  removeNotificationCallback(callback: (notification: any) => void) {
    this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
