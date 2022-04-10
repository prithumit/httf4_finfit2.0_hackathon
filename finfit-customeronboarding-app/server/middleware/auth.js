const axios = require('axios')

const { services } = require('../config/config.json')

const tokenObj = {}

const auth = function (req, res, next) {
  const axiosOptions = {
    method: 'POST',
    url: `${process.env.AUTH_CLIENT_URI}`,
    headers: {
      'X-TENANT-ID': 'FINASTRA',
      'locale': 'en',
      'Content-Type': 'application/json',
      'idempotency-key': '123456'
    },
    data: {
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET
    }
  }

  if (!req.path.includes('api')) {
    if (!process.env.TOKEN.length && !tokenObj.accessToken) {
      axios(axiosOptions)
        .then(({ data = {} }) => {
          Object.assign(tokenObj, data)
          req.Authorization = `Bearer ${data.accessToken}`
          next()
        })
        .catch((error) => {
          console.log(error)
        })
    } else if (tokenObj.accessToken) {
      if (Date.now() < tokenObj.expiresIn) {
        req.Authorization = `Bearer ${tokenObj.accessToken}`

        next()
      } else {
        delete tokenObj.accessToken

        auth(req, res, next)
      }
    }
  } else {
    next()
  }
}

module.exports = auth
