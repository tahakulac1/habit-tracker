const request = require('supertest');
const app = require("../src/app");
const { pool, initDB } = require('../src/db');

beforeAll(async () => {
    await initDB()
})
beforeEach(async () => {
    await pool.query('DELETE FROM habits')
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
    const res = await request(app).post('/habits').send({ title: 'Read a book' })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Read a book')
    expect(res.body.completed).toBe(false)
 
})
test('GET /habits returns the list of habits', async () => {
    await request(app).post('/habits').send({ title: 'Drink water'})

    const res = await request(app).get('/habits')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('Drink water')
})

test('GET /habits/:id returns habit by id', async () => {

    const created = await request(app).post('/habits').send({ title: 'Run 4 kilometers'})
    const res = await request(app).get(`/habits/${created.body.id}`)
    
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Run 4 kilometers')
})

test('GET /habits/:id returns 404: habit not found', async () => {
    const res = await request(app).get('/habits/99999999')

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Habit not found')
})