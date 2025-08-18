import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Spinner, Table, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Adjust the URL as needed for your backend
        const response = await axios.get('/api/transactions');
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1>Transactions</h1>
          <p>This page will display user transaction history.</p>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.date).toLocaleString()}</td>
                      <td>{tx.type}</td>
                      <td>{tx.itemTitle}</td>
                      <td>RWF {tx.amount?.toLocaleString()}</td>
                      <td>
                        <Badge bg={tx.status === 'SUCCESS' ? 'success' : tx.status === 'PENDING' ? 'warning' : 'danger'}>
                          {tx.status}
                        </Badge>
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

export default Transactions; 