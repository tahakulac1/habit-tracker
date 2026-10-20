const request = require('supertest');
const app = require("../src/app");
const { pool, initDB } = require('../src/db');

beforeAll(async () => {
    await initDB()
})
afterAll(async () => {
    await pool.end()
})

test('GET / returns the API name', async () => {
    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.text).toBe(`Habit Tracker API`)
 })
