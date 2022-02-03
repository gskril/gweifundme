const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// app.get any path after /user/:id
app.get('/:address', (req, res) => {
  const address = req.params.address
  res.render('donation.ejs', { address: address })
})