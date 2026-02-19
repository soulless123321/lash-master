const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/bookings', (req, res) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const { name, phone, service, message } = req.body;
    
    if (!name || !phone || !service) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const stmt = db.prepare('INSERT INTO bookings (name, phone, service, message) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, phone, service, message || '');
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Админ-панель: http://localhost:${PORT}/admin`);
});
