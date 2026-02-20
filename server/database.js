const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

let db;

async function initDB() {
    const SQL = await initSqlJs();
    
    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }
    
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT,
            time TEXT,
            message TEXT,
            status TEXT DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    try {
        db.run('ALTER TABLE bookings ADD COLUMN date TEXT');
    } catch (e) {}
    
    try {
        db.run('ALTER TABLE bookings ADD COLUMN time TEXT');
    } catch (e) {}
    
    try {
        db.run('ALTER TABLE bookings ADD COLUMN time_from TEXT');
    } catch (e) {}
    
    try {
        db.run('ALTER TABLE bookings ADD COLUMN time_to TEXT');
    } catch (e) {}
    
    try {
        db.run('ALTER TABLE bookings ADD COLUMN called INTEGER DEFAULT 0');
    } catch (e) {}
    
    try {
        db.run('ALTER TABLE bookings ADD COLUMN admin_comment TEXT');
    } catch (e) {}
    
    saveDB();
    
    return db;
}

function saveDB() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

function getDB() {
    return db;
}

module.exports = { initDB, getDB, saveDB };
