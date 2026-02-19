const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lash2026';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const sessions = new Map();

function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
}

function checkAuth(req) {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    return sessionId && sessions.has(sessionId);
}

let dbModule = null;

async function getDb() {
    if (!dbModule) {
        dbModule = require('./database');
        await dbModule.initDB();
    }
    return dbModule;
}

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
        const sessionId = generateSessionId();
        sessions.set(sessionId, { created: Date.now() });
        res.json({ success: true, token: sessionId });
    } else {
        res.status(401).json({ success: false, error: 'Неверный пароль' });
    }
});

app.get('/api/bookings', async (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    try {
        const { getDB } = await getDb();
        const database = getDB();
        const results = database.exec('SELECT * FROM bookings ORDER BY created_at DESC');
        
        if (results.length === 0) {
            return res.json([]);
        }
        
        const columns = results[0].columns;
        const values = results[0].values;
        const bookings = values.map(row => {
            const obj = {};
            columns.forEach((col, i) => obj[col] = row[i]);
            return obj;
        });
        
        res.json(bookings);
    } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/booked-dates', async (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    try {
        const { getDB } = await getDb();
        const database = getDB();
        const results = database.exec("SELECT date, time FROM bookings WHERE date != '' AND date IS NOT NULL");
        
        if (results.length === 0) {
            return res.json([]);
        }
        
        const bookedSlots = results[0].values
            .filter(row => row[0])
            .map(row => ({
                date: row[0],
                time: row[1]
            }));
        
        res.json(bookedSlots);
    } catch (error) {
        console.error('Error getting booked dates:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/dates', async (req, res) => {
    try {
        const { getDB } = await getDb();
        const database = getDB();
        const results = database.exec("SELECT date, time FROM bookings WHERE date != '' AND date IS NOT NULL");
        
        if (results.length === 0) {
            return res.json([]);
        }
        
        const bookedSlots = results[0].values
            .filter(row => row[0])
            .map(row => ({
                date: row[0],
                time: row[1]
            }));
        
        res.json(bookedSlots);
    } catch (error) {
        console.error('Error getting dates:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        console.log('Получена заявка:', req.body);
        
        const { name, phone, service, date, time, message } = req.body;
        
        if (!name || !phone || !service) {
            return res.status(400).json({ error: 'Заполните все обязательные поля' });
        }
        
        const { getDB, saveDB } = await getDb();
        const database = getDB();
        
        const stmt = database.prepare('INSERT INTO bookings (name, phone, service, date, time, message) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run([name, phone, service, date || '', time || '', message || '']);
        stmt.free();
        
        saveDB();
        console.log('Заявка сохранена в БД');
        
        const lastId = database.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
        
        res.json({ success: true, id: lastId });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/bookings/:id', async (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    try {
        const { getDB, saveDB } = await getDb();
        const database = getDB();
        database.run('DELETE FROM bookings WHERE id = ?', [req.params.id]);
        saveDB();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    const sessionId = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId || !sessions.has(sessionId)) {
        return res.sendFile(path.join(__dirname, 'login.html'));
    }
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/consent', (req, res) => {
    res.sendFile(path.join(__dirname, 'consent.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.VERCEL === undefined) {
    getDb().then(() => {
        app.listen(PORT, () => {
            console.log(`Сервер запущен: http://localhost:${PORT}`);
            console.log(`Админ-панель: http://localhost:${PORT}/admin`);
        });
    });
}

module.exports = app;
