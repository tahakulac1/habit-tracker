const cors = require('cors')
const express = require(`express`)
const {pool} = require('./db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
app.use(cors())
app.use(express.json())

function authenticate(req, res, next) {
    const header = req.get('authorization')
    if(!header) {
        return res.status(401).json({error: 'Token is required'})
    }
    const token = header.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = payload.userId
        next()

    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token'})
    }
    
}

app.get(`/`, (req,res) => {
    res.send(`Habit Tracker API`)
})

app.post(`/habits`, authenticate, async(req, res) => {
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
app.post(`/auth/register`, async(req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required'})
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters'})
        }
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address'})
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        )
        res.status(201).json(result.rows[0])
    }catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email is already registered'})
        }
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }

})
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'})
        }
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(result.rows.length === 0) {
            return res.status(401).json({error: 'Invalid email or password'})
        }
        const user = result.rows[0]
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if(!isMatch) {
            return res.status(401).json({error: 'Invalid email or password'})
        }
        const token = jwt.sign({ userId: user.id},
            process.env.JWT_SECRET, { expiresIn: '1h'})
        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } })
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})


app.get(`/habits`, authenticate, async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM habits')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})
app.get('/habits/:id', authenticate, async(req,res) => {
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
app.put(`/habits/:id`, authenticate, async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        const result = await pool.query(
            'UPDATE habits SET completed = NOT completed WHERE id = $1 RETURNING *',[id]
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
app.delete('/habits/:id', authenticate, async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        const result = await pool.query(
            'DELETE FROM habits WHERE id = $1 RETURNING *', [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found'})
        }
        res.json({message: 'Habit deleted successfully'})
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'db error'})
    }
})

module.exports = app;