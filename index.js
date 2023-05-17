const express = require('express')
const app = express()
const port = process.env.PORT||5000
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Toy Joy Online is running')
})

app.listen(port, () => {
  console.log(`Toy Joy Online is listening on port ${port}`)
})