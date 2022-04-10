const axios = require('axios')

exports.initiateRequest = function (req, method, type, res, data = {}, form = false) {
  const { Authorization = "" } = req
  const errorCodes = [400, 500, 403]
  const headers = {
    tenantId: 'PROD',
    locale: 'en',
    Authorization,
  }

  if (process.env.TOKEN.length) {
    Object.assign(headers, { Authorization: `Bearer ${process.env.TOKEN}`, })
  }

  if (form) {
    Object.assign(headers, form)
  }

  console.log(headers);
  const config = {
    method,
    url: `${process.env.BASE_URL}${type}`,
    headers,
    data
  }

  console.log(`\n\n headers: ${JSON.stringify(headers)} \n request: ${process.env.BASE_URL}${type}`);

  return axios(config)
    .then((response) => {
      return res.json(JSON.parse(JSON.stringify(response.data)))
    })
    .catch((error) => {
      if (error.response) {
        if (errorCodes.includes(error.response.status)) {
          return res.status(error.response.status).json(JSON.parse(JSON.stringify(error.response.data)))
        } else {
          console.log(error)
          console.log(error.response.data.causes)
          // console.log(error.response.status)
          // console.log(error.response.headers)
        }
      } else {
        console.log(error)
      }
    })

}
