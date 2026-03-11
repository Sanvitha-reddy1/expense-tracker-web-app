const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    amount REAL
  )`);
});

app.get('/expenses', (req, res) => {
  db.all("SELECT * FROM expenses", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/expenses', (req, res) => {
  const { title, amount } = req.body;
  db.run("INSERT INTO expenses(title, amount) VALUES (?, ?)",
    [title, amount],
    function(err) {
      res.json({ id: this.lastID });
    });
});

app.delete('/expenses/:id', (req, res) => {
  db.run("DELETE FROM expenses WHERE id=?", req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));