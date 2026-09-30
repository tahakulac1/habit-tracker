const express = require(`express`)
const app = express()
app.get(`/`, (req,res) => {
    res.send(`Habit Tracker API`)
})
app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})
