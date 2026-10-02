const express = require(`express`)
const app = express()
app.use(express.json())
app.get(`/`, (req,res) => {
    res.send(`Habit Tracker API`)
})
const habits = []
let nextId = 1

app.post(`/habits`, (req, res) => {
    const title = req.body.title
    const newHabit = {
        id: nextId++,
        title: title,
        completed: false
    }
    habits.push(newHabit)
    res.status(201).json(newHabit)
    console.log('new habit created')
})
app.get(`/habits`, (req, res) => {
    res.json(habits)
    console.log(habits)
})
app.get('/habits/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const habit = habits.find(h => h.id === id)

    if (!habit) {
        return res.status(404).json({error: 'Habit not found'})
    }
    res.json(habit)

})
app.put(`/habits/:id`, (req, res) => {
    const id = parseInt(req.params.id)
    const habit = habits.find(h => h.id === id)
    if(!habit) {
        return res.status(404).json({ error: `Habit not found`})
    }
    habit.completed = true
    res.json(habit)
    console.log(habits)
})
app.delete('/habits/:id', (req, res) => {
    const id = parseInt(req.params.id)   
    const index = habits.findIndex(h=> h.id === id)

    if (index === -1) {
        return res.status(404).json({ error: 'Habit not found'})
    }
    habits.splice(index,1)
    res.json({ message: 'Habit deleted successfully'})
})
app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})