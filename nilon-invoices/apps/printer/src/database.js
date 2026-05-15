const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../printer.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS print_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderCode TEXT UNIQUE,
    customerName TEXT,
    phone TEXT,
    address TEXT,
    totalAmount REAL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS print_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER,
    productName TEXT,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(orderId) REFERENCES print_orders(id)
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    level TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = {
  db,
  saveOrder: (order) => {
    const insertOrder = db.prepare(`
      INSERT INTO print_orders (orderCode, customerName, phone, address, totalAmount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const insertItem = db.prepare(`
      INSERT INTO print_order_items (orderId, productName, quantity, price)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = db.transaction((orderData) => {
      const info = insertOrder.run(
        orderData.orderCode,
        orderData.customerName,
        orderData.phone,
        orderData.address,
        orderData.totalAmount,
        'pending'
      );
      
      const orderId = info.lastInsertRowid;
      
      for (const item of orderData.items) {
        insertItem.run(orderId, item.productName, item.quantity, item.price);
      }
      
      return orderId;
    });

    return transaction(order);
  },

  updateOrderStatus: (orderCode, status) => {
    const stmt = db.prepare('UPDATE print_orders SET status = ? WHERE orderCode = ?');
    return stmt.run(status, orderCode);
  },

  log: (message, level = 'info') => {
    const stmt = db.prepare('INSERT INTO logs (message, level) VALUES (?, ?)');
    stmt.run(message, level);
  }
};
