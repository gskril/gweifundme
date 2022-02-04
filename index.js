const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/:address', async (req, res) => {
  const address = req.params.address
  
  if (address.length !== 42 && !address.endsWith('.eth')) {
		return res.render('index.ejs', { error: 'Invalid wallet address' })
  }

  await axios
    .get(`https://api.ensideas.com/ens/resolve/${address}`, {
      setTimeout: 1000
    })
    .then(async (api) => {
      let data = await api.data
      let ens
      if (data.name === null) {
        ens = address.slice(0, 8)
      } else if (data.address === null) {
        // Check for invalid ENS name
        return res.render('index.ejs', { error: 'Invalid ENS name' })
      } else {
        ens = data.name
      }
      res.render('donation.ejs', { address: address, ens: ens })
    })
    .catch(err => {
      console.log('Error fetching data from ensideas api.', err.response)

      try {
        res.render('donation.ejs', { address: address, ens: address.slice(0, 8) })
      } catch (error) {
        res.render('index.ejs', {
          error: 'Error resolving ENS name, please try with a full Ethereum address.'
        })
      }
    })
})
