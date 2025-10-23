// src/components/OrderList.js
import React, { useState, useEffect } from "react";
import "./OrderList.css";

function OrderList() {
  // State: Data that can change and cause re-renders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: Runs code after component renders
  useEffect(() => {
    fetchOrders();
  }, []);

  // Async function to fetch data
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="order-list-container">
      <h2>Orders ({orders.length})</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>{order.studentName}</h3>
            <p>{order.room}</p>
            <p>{order.school}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.name}
                  {item.customizations.length > 0 &&
                    ` (${item.customizations.join(", ")})`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
