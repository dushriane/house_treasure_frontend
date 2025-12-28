import React, { useState } from 'react';
import { Modal, Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FaMoneyBillWave, FaPhone, FaCheckCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const PaymentModal = ({ 
  show, 
  onHide, 
  transaction, 
  onPaymentConfirm 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState(1); // 1: Select method, 2: Enter confirmation

  const handleInitiatePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      // Simulate payment initiation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to confirmation step
      setPaymentStep(2);
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirmationCode || confirmationCode.length < 4) {
      setError('Please enter a valid confirmation code');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      // Call the parent's confirmation handler
      await onPaymentConfirm({
        transactionId: transaction?.id,
        paymentMethod,
        phoneNumber,
        confirmationCode
      });
      
      // Close modal on success
      handleClose();
    } catch (err) {
      setError(err.message || 'Payment confirmation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setPaymentMethod('mtn');
    setPhoneNumber('');
    setConfirmationCode('');
    setPaymentStep(1);
    setError('');
    setProcessing(false);
    onHide();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaMoneyBillWave className="me-2" />
          Complete Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transaction && (
          <div className="payment-info mb-4">
            <h6 className="mb-3">Transaction Details</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Item:</span>
              <strong>{transaction.itemTitle}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Amount:</span>
              <strong className="text-primary">{formatCurrency(transaction.amount)}</strong>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {paymentStep === 1 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <div className="d-grid gap-2">
                <Button
                  variant={paymentMethod === 'mtn' ? 'warning' : 'outline-warning'}
                  onClick={() => setPaymentMethod('mtn')}
                  className="text-start d-flex align-items-center"
                >
                  <div className="payment-logo me-3" style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#FFCB05',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    MTN
                  </div>
                  <div>
                    <div className="fw-bold">MTN Mobile Money</div>
                    <small className="text-muted">Pay with MTN MoMo</small>
                  </div>
                  {paymentMethod === 'mtn' && (
                    <FaCheckCircle className="ms-auto text-success" />
                  )}
                </Button>
                
                <Button
                  variant={paymentMethod === 'airtel' ? 'danger' : 'outline-danger'}
                  onClick={() => setPaymentMethod('airtel')}
                  className="text-start d-flex align-items-center"
                >
                  <div className="payment-logo me-3" style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#ED1C24',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}>
                    AM
                  </div>
                  <div>
                    <div className="fw-bold">Airtel Money</div>
                    <small className="text-muted">Pay with Airtel Money</small>
                  </div>
                  {paymentMethod === 'airtel' && (
                    <FaCheckCircle className="ms-auto text-success" />
                  )}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaPhone />
                </InputGroup.Text>
                <Form.Control
                  type="tel"
                  placeholder="078XXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={processing}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Enter the {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'} Mobile Money number
              </Form.Text>
            </Form.Group>

            <Alert variant="info" className="small">
              <strong>How it works:</strong>
              <ol className="mb-0 ps-3 mt-2">
                <li>Click "Initiate Payment" below</li>
                <li>You'll receive a prompt on your phone</li>
                <li>Enter your Mobile Money PIN</li>
                <li>Enter the confirmation code here</li>
              </ol>
            </Alert>
          </>
        )}

        {paymentStep === 2 && (
          <>
            <Alert variant="success">
              <FaCheckCircle className="me-2" />
              Payment request sent to your phone!
            </Alert>

            <p className="text-muted mb-3">
              Please check your phone for the payment prompt and enter your Mobile Money PIN. 
              Then enter the confirmation code you received below.
            </p>

            <Form.Group className="mb-3">
              <Form.Label>Confirmation Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                disabled={processing}
              />
            </Form.Group>

            <Button
              variant="link"
              onClick={() => setPaymentStep(1)}
              disabled={processing}
              className="p-0 mb-3"
            >
              ← Back to payment details
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={processing}>
          Cancel
        </Button>
        {paymentStep === 1 ? (
          <Button 
            variant="primary" 
            onClick={handleInitiatePayment}
            disabled={processing || !phoneNumber}
          >
            {processing ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Processing...
              </>
            ) : (
              'Initiate Payment'
            )}
          </Button>
        ) : (
          <Button 
            variant="success" 
            onClick={handleConfirmPayment}
            disabled={processing || !confirmationCode}
          >
            {processing ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Confirming...
              </>
            ) : (
              'Confirm Payment'
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

PaymentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    itemTitle: PropTypes.string,
    amount: PropTypes.number
  }),
  onPaymentConfirm: PropTypes.func.isRequired
};

export default PaymentModal;
