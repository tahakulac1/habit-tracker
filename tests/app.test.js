const request = require('supertest');
const app = require("../src/app");
const { pool, initDB } = require('../src/db');

beforeAll(async () => {
    await initDB()
})
beforeEach(async () => {
    await pool.query('DELETE FROM habits')
    await pool.query('DELETE FROM users')
})
afterAll(async () => {
    await pool.end()
})

test('GET / returns the API name', async () => {
    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.text).toBe(`Habit Tracker API`)
 })

 test('POST /habits creates a habit', async () => {
    const res = await request(app).post('/habits').send({ title: 'habit1' })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('habit1')
    expect(res.body.completed).toBe(false)
 
})
test('POST /auth/register creates a user', async () => {
    const res = await request(app).post('/auth/register').send({username: 'Taha', email: 'taha@example.com', password: 'Secret123'})

    expect(res.status).toBe(201)
    expect(res.body.username).toBe('Taha')
    expect(res.body.email).toBe('taha@example.com')
    expect(res.body.password_hash).toBeUndefined()
})
test('POST /auth/register returns 400 for missing user information', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'berkay@example.com', password: 'Secret123'  })
    
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Username, email, and password are required')
})
test('GET /habits returns the list of habits', async () => {
    await request(app).post('/habits').send({ title: 'habit2'})

    const res = await request(app).get('/habits')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('habit2')
})

test('GET /habits/:id returns habit by id', async () => {

    const created = await request(app).post('/habits').send({ title: 'habit3'})
    const res = await request(app).get(`/habits/${created.body.id}`)
    
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('habit3')
})

test('GET /habits/:id returns 404 for a missing habit', async () => {
    const res = await request(app).get('/habits/99999999')

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Habit not found')
})

test('PUT /habits/:id changes the state of a habit by id', async () => {
    const created = await request(app).post('/habits').send({ title: 'habit4'})
    const res = await request(app).put(`/habits/${created.body.id}`)

    expect(res.status).toBe(200)
    expect(res.body.completed).toBe(true)
})

test('PUT /habits/:id returns 404 for a missing habit', async () => {
    const res = await request(app).put('/habits/99999999')

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Habit not found')
})

test('PUT /habits/:id toggles back to not completed when called twice', async () => {
    const created = await request(app).post('/habits').send({ title: 'habit5'})
    await request(app).put(`/habits/${created.body.id}`)
    const res = await request(app).put(`/habits/${created.body.id}`)

    expect(res.status).toBe(200)
    expect(res.body.completed).toBe(false)
})

test('DELETE /habits/:id deletes habit by id', async () => {
    const created = await request(app).post('/habits').send({title: 'habit6'})
    const res = await request(app).delete(`/habits/${created.body.id}`)
    
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Habit deleted successfully')
})

test('DELETE /habits/:id returns 404 for a missing habit', async () => {
    const res = await request(app).delete('/habits/9999999')

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Habit not found')
})