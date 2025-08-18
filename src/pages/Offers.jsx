import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get('/api/offers');
        setOffers(res.data);
      } catch (err) {
        setError('Failed to load offers.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAccept = async (offerId) => {
    try {
      await axios.post(`/api/offers/${offerId}/accept`);
      setActionMsg('Offer accepted!');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'ACCEPTED' } : o));
    } catch {
      setActionMsg('Failed to accept offer.');
    }
  };

  const handleReject = async (offerId) => {
    try {
      await axios.post(`/api/offers/${offerId}/reject`);
      setActionMsg('Offer rejected.');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'REJECTED' } : o));
    } catch {
      setActionMsg('Failed to reject offer.');
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1>Offers</h1>
          <p>Manage offers you have received or sent.</p>
          {actionMsg && <Alert variant="info" onClose={() => setActionMsg('')} dismissible>{actionMsg}</Alert>}
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>From</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No offers found.</td>
                  </tr>
                ) : (
                  offers.map(offer => (
                    <tr key={offer.id}>
                      <td>{offer.itemTitle}</td>
                      <td>{offer.fromUserName}</td>
                      <td>RWF {offer.amount?.toLocaleString()}</td>
                      <td>
                        <Badge bg={
                          offer.status === 'ACCEPTED'
                            ? 'success'
                            : offer.status === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }>
                          {offer.status}
                        </Badge>
                      </td>
                      <td>{new Date(offer.date).toLocaleString()}</td>
                      <td>
                        {offer.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              className="me-2"
                              onClick={() => handleAccept(offer.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(offer.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Offers;