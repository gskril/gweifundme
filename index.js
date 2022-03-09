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

  // Special case for Ukraine
  if (address === 'ukraine' || address === '0x165CD37b4C644C2921454429E7F9358d18A45e14') {
    return res.render('donation.ejs', {
      address: '0x165CD37b4C644C2921454429E7F9358d18A45e14',
      ens: 'Ukraine',
      avatar: null,
    })
  }
  
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
      if (data.address === null) {
        // Check for invalid ENS name
        return res.render('index.ejs', { error: 'Invalid ENS name' })
      } else {
        res.render('donation.ejs', {
          address: data.address,
          ens: data.displayName,
          avatar: data.avatar,
        })
      }
    })
    .catch(err => {
      console.log('Error fetching data from ensideas api.', err)

      try {
        res.render('donation.ejs', {
          address: address,
          ens: address.slice(0, 5) + '...' + address.slice(-4),
        })
      } catch (error) {
        res.render('index.ejs', {
          error: 'Error validating that address, please try again.'
        })
      }
    })
})

app.use((req, res) => {
  res.status(404).render('index.ejs', { error: 'Page not found' })
})
