const express = require(`express`)
const pool = require('./db')
const app = express()
app.use(express.json())
app.get(`/`, (req,res) => {
    res.send(`Habit Tracker API`)
})

app.post(`/habits`, async(req, res) => {
    try {
        const title = req.body.title
        const result = await pool.query(
            'INSERT INTO habits (title) VALUES ($1) RETURNING *',
            [title]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }

})
app.get(`/habits`, async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM habits')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})
app.get('/habits/:id', async(req,res) => {
    try {
        const id = parseInt(req.params.id)
        const result = await pool.query('SELECT * FROM habits WHERE id = $1', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found'})
        }
        res.json(result.rows[0])
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})
app.put(`/habits/:id`, async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        const result = await pool.query(
            'UPDATE habits SET completed = true WHERE id = $1 RETURNING *',[id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found'})
        }
        res.json(result.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})
app.delete('/habits/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        const result = await pool.query(
            'DELETE FROM habits WHERE id = $1 RETURNING *', [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found'})
        }
        res.json({error: 'Habit deleted successfully'})
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})
app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})