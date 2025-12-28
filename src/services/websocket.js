import config from '../config';

// WebSocket Service for Real-time Messaging
class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
    this.messageQueue = [];
    this.isConnected = false;
    this.userId = null;
  }

  connect(userId, token) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.userId = userId;
    const wsUrl = config.wsUrl;
    
    try {
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}&token=${token}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          this.send(message);
        }
        
        this.emit('connected', { userId });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        if (this.userId) {
          // Get fresh token from localStorage - consider implementing token refresh endpoint
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token available for reconnection');
            this.emit('reconnect-failed');
            return;
          }
          this.connect(this.userId, token);
        }
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect-failed');
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.log('WebSocket not connected, queueing message');
      this.messageQueue.push(message);
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'NEW_MESSAGE':
        this.emit('new-message', payload);
        break;
      case 'MESSAGE_READ':
        this.emit('message-read', payload);
        break;
      case 'USER_TYPING':
        this.emit('user-typing', payload);
        break;
      case 'USER_ONLINE':
        this.emit('user-online', payload);
        break;
      case 'USER_OFFLINE':
        this.emit('user-offline', payload);
        break;
      case 'NOTIFICATION':
        this.emit('notification', payload);
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }

  // Event management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Message-specific methods
  sendMessage(conversationId, message) {
    this.send({
      type: 'SEND_MESSAGE',
      payload: {
        conversationId,
        message
      }
    });
  }

  markAsRead(messageId) {
    this.send({
      type: 'MARK_AS_READ',
      payload: { messageId }
    });
  }

  sendTypingIndicator(conversationId, isTyping) {
    this.send({
      type: 'TYPING',
      payload: {
        conversationId,
        isTyping
      }
    });
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queueLength: this.messageQueue.length
    };
  }
}

// Export singleton instance
const wsService = new WebSocketService();
export default wsService;
