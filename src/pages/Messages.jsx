import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Badge, Alert, Card, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { messagesAPI } from '../services/api.js';
import { FaComments, FaPaperPlane, FaUser, FaSearch, FaClock, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { DashboardLayout, LoadingSpinner, AlertMessage } from '../components';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
    }
  }, [selectedConv]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations(user.id);
      setConversations(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setMsgLoading(true);
      const response = await messagesAPI.getMessages(conversationId);
      setMessages(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedConv) return;
    
    try {
      setSending(true);
      const response = await messagesAPI.sendMessage(selectedConv.id, {
        text: newMsg.trim(),
        senderId: user.id
      });
      
      setMessages(prev => [...prev, response.data]);
      setNewMsg('');
      setSuccessMsg('Message sent successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv =>
    conv.participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getMessageStatus = (message) => {
    if (message.senderId === user.id) {
      if (message.read) {
        return <FaCheckDouble className="message-status read" />;
      } else if (message.delivered) {
        return <FaCheck className="message-status delivered" />;
      } else {
        return <FaClock className="message-status sent" />;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout title="Messages">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages & Conversations">
      {successMsg && (
        <Row className="mb-3">
          <Col>
            <AlertMessage 
              variant="success" 
              message={successMsg} 
              onClose={() => setSuccessMsg('')}
            />
          </Col>
        </Row>
      )}

      <Row className="messages-container">
        {/* Conversations Sidebar */}
        <Col lg={4} className="conversations-sidebar">
          <Card className="conversations-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaComments className="me-2" />
                Conversations
              </h5>
              <Badge bg="primary">{conversations.length}</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {/* Search Bar */}
              <div className="conversation-search p-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>

              {/* Conversations List */}
              <div className="conversations-list">
                {error && (
                  <div className="p-3">
                    <Alert variant="danger" className="mb-0">
                      {error}
                      <br />
                      <Button variant="outline-danger" size="sm" onClick={fetchConversations} className="mt-2">
                        Retry
                      </Button>
                    </Alert>
                  </div>
                )}
                
                {filteredConversations.length === 0 ? (
                  <div className="conversations-empty">
                    <FaComments className="empty-icon" />
                    <h6>No conversations yet</h6>
                    <p className="text-muted">
                      {searchTerm ? 'No conversations match your search.' : 'Your conversations will appear here.'}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`conversation-item ${selectedConv?.id === conv.id ? 'active' : ''}`}
                      onClick={() => setSelectedConv(conv)}
                    >
                      <div className="conversation-avatar">
                        <FaUser />
                      </div>
                      <div className="conversation-details">
                        <div className="conversation-header">
                          <h6 className="conversation-name">{conv.participantName}</h6>
                          <span className="conversation-time">
                            {formatMessageTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="conversation-preview">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge bg="primary" className="unread-badge">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Messages Area */}
        <Col lg={8} className="messages-area">
          <Card className="messages-card">
            {selectedConv ? (
              <>
                <Card.Header className="d-flex align-items-center">
                  <div className="selected-conversation-avatar">
                    <FaUser />
                  </div>
                  <div className="selected-conversation-info">
                    <h5 className="mb-0">{selectedConv.participantName}</h5>
                    <span className="text-muted">
                      {selectedConv.isOnline ? 'Online' : `Last seen ${formatMessageTime(selectedConv.lastSeen)}`}
                    </span>
                  </div>
                </Card.Header>
                
                <Card.Body className="messages-body">
                  {msgLoading ? (
                    <div className="messages-loading">
                      <LoadingSpinner />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="messages-empty">
                      <FaComments className="empty-icon" />
                      <h6>No messages yet</h6>
                      <p className="text-muted">Start the conversation by sending a message below.</p>
                    </div>
                  ) : (
                    <div className="messages-list">
                      {messages.map((message, idx) => (
                        <div
                          key={idx}
                          className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
                        >
                          <div className="message-content">
                            <p className="message-text">{message.text}</p>
                            <div className="message-meta">
                              <span className="message-time">
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {getMessageStatus(message)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </Card.Body>

                <Card.Footer className="message-input-footer">
                  <Form onSubmit={handleSend}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        disabled={sending}
                      />
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={sending || !newMsg.trim()}
                      >
                        {sending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <FaPaperPlane />
                        )}
                      </Button>
                    </InputGroup>
                  </Form>
                </Card.Footer>
              </>
            ) : (
              <div className="no-conversation-selected">
                <FaComments className="empty-icon" />
                <h5>Select a conversation</h5>
                <p className="text-muted">
                  Choose a conversation from the sidebar to start messaging.
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Messages;