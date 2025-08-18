import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/messages/conversations');
        setConversations(res.data);
      } catch (err) {
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConv) return;
    const fetchMessages = async () => {
      setMsgLoading(true);
      try {
        const res = await axios.get(`/api/messages/${selectedConv.id}`);
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load messages.');
      } finally {
        setMsgLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConv]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedConv) return;
    try {
      const res = await axios.post(`/api/messages/${selectedConv.id}`, { text: newMsg });
      setMessages([...messages, res.data]);
      setNewMsg('');
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <h2>Conversations</h2>
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <ListGroup>
              {conversations.length === 0 ? (
                <ListGroup.Item>No conversations found.</ListGroup.Item>
              ) : (
                conversations.map(conv => (
                  <ListGroup.Item
                    key={conv.id}
                    active={selectedConv && conv.id === selectedConv.id}
                    onClick={() => setSelectedConv(conv)}
                    style={{ cursor: 'pointer' }}
                  >
                    {conv.participantName}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          )}
        </Col>
        <Col md={8}>
          <h2>Messages</h2>
          {msgLoading ? (
            <Spinner animation="border" />
          ) : selectedConv ? (
            <Card>
              <Card.Body style={{ maxHeight: 350, overflowY: 'auto' }}>
                {messages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem' }}>
                      <strong>{msg.senderName}: </strong>
                      <span>{msg.text}</span>
                      <div style={{ fontSize: '0.8em', color: '#888' }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
              <Card.Footer>
                <Form onSubmit={handleSend} className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                  />
                  <Button type="submit" variant="primary" className="ms-2">
                    Send
                  </Button>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <Alert variant="info">Select a conversation to view messages.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;