// src/App.js
import React from 'react';
import './App.css';
import OrderList from './components/OrderList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Naru Sushi Order Management</h1>
        <p>School Lunch Order System</p>0
      </header>

      <main className="App-main">
        <OrderList />
      </main>
    </div>
  );
}

export default App;
