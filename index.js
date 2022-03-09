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
  let address = req.params.address
  
  if (address.length !== 42 && !address.endsWith('.eth')) {
    if (address === 'ukraine') {
      return res.render('donation.ejs', { address: '0x165CD37b4C644C2921454429E7F9358d18A45e14', ens: 'Ukraine' })
    }
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
        if (data.address === '0x165CD37b4C644C2921454429E7F9358d18A45e14') {
          ens = 'Ukraine'
        } else {
          ens = address.slice(0, 8)
        }
      } else if (data.address === null) {
        // Check for invalid ENS name
        return res.render('index.ejs', { error: 'Invalid ENS name' })
      } else {
        address = data.address
        ens = data.name
        avatar = data.avatar
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

app.use((req, res) => {
  res.status(404).render('index.ejs', { error: 'Page not found' })
})
