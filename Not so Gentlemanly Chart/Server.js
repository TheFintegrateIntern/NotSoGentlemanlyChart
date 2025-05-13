const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server', // e.g. localhost
  database: 'OffenseDB',
  options: {
    encrypt: false, // true if using Azure
    trustServerCertificate: true
  }
};

// Get all offenses
app.get('/api/offenses', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT * FROM Offenses');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update offense count
app.post('/api/offenses/:name', async (req, res) => {
  const { name } = req.params;
  const { count } = req.body;

  try {
    await sql.connect(dbConfig);
    await sql.query`UPDATE Offenses SET Count = ${count} WHERE Name = ${name}`;
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
