import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../utils/stripe';
import { useCart } from '../hooks/useCart';
import CheckoutForm from './CheckoutForm';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    parentName: '',
    parentEmail: '',
    phone: ''
  });

  const totalAmount = getTotalPrice();

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/menu');
      return;
    }

    // Create payment intent
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          metadata: {
            itemCount: getTotalItems(),
            orderDate: new Date().toISOString()
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } else {
        setError(data.error || 'Failed to initialize payment');
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to connect to payment service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const isCustomerInfoValid = () => {
    return customerInfo.parentName && 
           customerInfo.parentEmail && 
           customerInfo.phone &&
           customerInfo.parentEmail.includes('@');
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Initializing secure payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="error-message">
            <h2>Payment Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/menu')}>Return to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="cart-items-summary">
            {cart.map((item) => (
              <div key={item.cartId} className="checkout-item">
                <div className="item-details">
                  <h3>{item.menuItem.name}</h3>
                  <p className="item-meta">
                    Student: {item.studentName} | Room: {item.roomNumber}
                  </p>
                  <p className="item-meta">
                    Delivery: {new Date(item.deliveryDate).toLocaleDateString()} | 
                    Rice: {item.riceType}
                  </p>
                  {item.notes && <p className="item-notes">Notes: {item.notes}</p>}
                </div>
                <div className="item-price">
                  <span className="quantity">Qty: {item.quantity}</span>
                  <span className="price">${item.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total-section">
            <h3>Total: ${totalAmount.toFixed(2)} NZD</h3>
            <p className="item-count">{getTotalItems()} item(s)</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-info-section">
          <h2>Parent/Guardian Information</h2>
          <div className="form-group">
            <label htmlFor="parentName">Full Name *</label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={customerInfo.parentName}
              onChange={handleCustomerInfoChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="parentEmail">Email Address *</label>
            <input
              type="email"
              id="parentEmail"
              name="parentEmail"
              value={customerInfo.parentEmail}
              onChange={handleCustomerInfoChange}
              required
              placeholder="your.email@example.com"
            />
            <small>Order confirmation will be sent to this email</small>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleCustomerInfoChange}
              required
              placeholder="021 234 5678"
            />
          </div>
        </div>

        {/* Payment Section */}
        {clientSecret && isCustomerInfoValid() && (
          <div className="payment-section">
            <h2>Payment Details</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                customerInfo={customerInfo}
                totalAmount={totalAmount}
              />
            </Elements>
          </div>
        )}

        {!isCustomerInfoValid() && (
          <div className="info-required-message">
            <p>Please fill in all customer information fields to continue with payment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;