const express = require('express');
const db = require('./dbConfig');
require('dotenv').config();
const app = express();
const port = 3000;
app.use(express.json());
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  );
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table ready');
  }
});
app.get('/test', (req, res) => {
  const testUser = { name: 'John Doe', email: 'john@example.com' };
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [testUser.name, testUser.email], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).send('Error inserting user');
      return;
    }
    db.query('SELECT * FROM users', (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users');
        return;
      }
      res.json(users);
    });
  });
});
app.get('/health', (req, res) => {
  res.cookie('name', 'express', { maxAge: 1000 * 60  }) 
     .status(200)
     .send({
    status: 'UP',
    port: port,
    db: db.config.host
     });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});