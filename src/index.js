const { initDB } = require('./db');
const app = require('./app')
const PORT = process.env.PORT || 3000

initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`)
    })
})