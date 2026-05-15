const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const { saveOrder, updateOrderStatus, log } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const API_SECRET_KEY = process.env.API_SECRET_KEY || 'nilon-secret-key-2024';

// Middleware to verify API key
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const OrderSchema = z.object({
  orderCode: z.string(),
  customerName: z.string(),
  phone: z.string(),
  address: z.string(),
  totalAmount: z.number(),
  items: z.array(z.object({
    productName: z.string(),
    quantity: z.number(),
    price: z.number(),
  })),
});

app.post('/api/print-orders', verifyApiKey, (req, res) => {
  try {
    const orderData = OrderSchema.parse(req.body);
    log(`Received order: ${orderData.orderCode}`);

    // 1. Save to SQLite
    const localId = saveOrder(orderData);

    // 2. Respond immediately
    res.json({ success: true, localId });

    // 3. Trigger printing process (via event emitter or global function)
    if (global.printOrder) {
      global.printOrder(orderData);
    }

  } catch (error) {
    console.error('API Error:', error);
    log(`API Error: ${error.message}`, 'error');
    res.status(400).json({ error: error.message });
  }
});

const startServer = (port = 5000) => {
  app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
    log(`Server started on port ${port}`);
  });
};

module.exports = { startServer };
