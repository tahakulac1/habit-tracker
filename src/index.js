const express = require(`express`)
const app = express()
app.use(express.json())
app.get(`/`, (req,res) => {
    res.send(`Habit Tracker API`)
})
const habits = []

app.post(`/habits`, (req, res) => {
    const title = req.body.title
    const newHabit = {
        id: habits.length + 1,
        title: title,
        completed: false
    }
    habits.push(newHabit)
    res.status(201).json(newHabit)
})
app.get(`/habits`, (req, res) => {
    res.json(habits)
})
app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})