import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'condo_db',
  password: 'your_password',
  port: 5432
});

app.use(bodyParser.json());

app.get('/appointments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments');
    res.json(result.rows);
  } catch (error) { res.status(500).send('Error fetching appointments'); }
});

app.post('/appointments', async (req, res) => {
  const { Subject, StartTime, EndTime, Status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (Subject, StartTime, EndTime, Status) VALUES ($1, $2, $3, $4) RETURNING *',
      [Subject, StartTime, EndTime, Status || 'Pending']
    );

    res.json(result.rows[0]);
  } catch (error) { res.status(500).send('Error creating appointment'); }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET Status = $1 WHERE Id = $2 RETURNING *',
      [Status, id]
    );

    if (result.rowCount === 0) { return res.status(404).send('Appointment not found'); }
    res.json(result.rows[0]);
  } catch (error) { res.status(500).send('Error updating appointment'); }
});

app.delete('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM appointments WHERE Id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) { return res.status(404).send('Appointment not found'); }
    res.json(result.rows[0]);
  } catch (error) { res.status(500).send('Error deleting appointment'); }
});

app.listen(port, () => { console.log(`Server running on http://localhost:${port}`); });