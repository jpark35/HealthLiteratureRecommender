// initDB.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./healthData.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`, (err) => {
    if (err) {
        console.error("Error creating users table:", err.message);
    } else {
        console.log("Users table created successfully");
    }
    });

    db.run(`CREATE TABLE IF NOT EXISTS queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
    if (err) {
        console.error("Error creating queries table:", err.message);
    } else {
        console.log("Queries table created successfully");
    }
    });
  
    db.close();
});
