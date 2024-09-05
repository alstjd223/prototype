'use strict';
const express = require('express');
const app = express();
const mysql = require('mysql');
const bp = require('body-parser');

app.use(bp.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'uhditknow'
});

db.connect((err) => {
    if (err) {
        console.error('연결 실패: ' + err.stack);
        return;
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/hd`);
});

app.get('/hd', (req, res) => {
    db.query('SELECT * FROM hardware', (err, results) => {
        if (err) {
            res.status(500).send();
            return;
        }
        res.send(results);
    });
});
