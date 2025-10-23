// backend/server.js

// Import required packages
const express = require('express');
const cors = require('cors');
const { orders, menuItems } = require('./data/orders');

// Create Express App
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET /api/orders - Get all orders
// Defines a GET endpoint
app.get('/api/orders', (req, res) => {
    res.json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// GET /api/menu - Get all menu items
app.get('/api/menu', (req, res) => {
    res.json({
        success: true,
        count: menuItems.length,
        data: menuItems
    });
});

// GET /api/production-list - Get production summary
app.get('/api/production-list', (req, res) => {
    const productionSummary = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            const key = `${item.name} ${item.customizations.join(' ')}`.trim();

            if (productionSummary[key]) {
                productionSummary[key] += item.quantity;
            } else {
                productionSummary[key] = item.quantity;
            }
        });
    });

    const productionList = Object.entries(productionSummary)
        .map(([item, quantity]) => ({ item, quantity }));

    res.json({
        success: true,
        data: productionList
    });
});

// Start server on specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});