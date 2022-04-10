const express = require('express')
const fs = require('fs')
const multiparty = require('multiparty')
const FormData = require('form-data')

const apiController = require('../controller/api.controller')
const config = require('../config/config.json')

const apiRouter = express.Router()

apiRouter.all('/saveData/:type?', (req, res) => {
  const data = req.body
  const { type } = req.params
  const { method } = req

  apiController.initiateRequest(req, method, type, res, data)
})

apiRouter.get('/getDDResults/:type?/:stype?/:pid?/:id?', (req, res) => {
  let reqRoute
  const queryParams = req.query
  const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&')
  const { type, stype, pid, id } = req.params
  const { method } = req

  reqRoute = (stype) ? type + '/' + stype : type
  reqRoute = (Object.keys(queryParams).length) ? reqRoute + '?' + queryString : reqRoute
  reqRoute = (pid) ? reqRoute + '/' + pid : reqRoute
  reqRoute = (id) ? reqRoute + '/' + id : reqRoute

  apiController.initiateRequest(req, method, reqRoute, res)
})

apiRouter.get('/service/m/:service/:type?/:stype?/:pid?/:id?', (req, res) => {
  let reqRoute
  const queryParams = req.query
  const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&')
  const { service, type, stype, pid, id } = req.params
  const { method } = req

  reqRoute = (stype) ? type + '/' + stype : type
  reqRoute = (Object.keys(queryParams).length) ? reqRoute + '?' + queryString : reqRoute
  reqRoute = (pid) ? reqRoute + '/' + pid : reqRoute
  reqRoute = (id) ? reqRoute + '/' + id : reqRoute
  reqRoute = `${config.services[service].target}/${reqRoute}`

  apiController.initiateRequest(req, method, reqRoute, res)
})

apiRouter.post('/service/u/:service?', (req, res) => {
  const Form = new multiparty.Form()
  const { service } = req.params
  const reqRoute = `${config.services[service].target}/`
  const { method } = req
  try {
    Form.parse(req, (err, fields, files) => {
      const form = new FormData()

      if (files && files.document && files.document[0]) {
        form.append('document', fs.createReadStream(files.document[0].path), { filename: files.document[0].originalFilename })
        form.append("documentCategoryId", fields.documentCategoryId.toString())
        if (fields.entityId) {
          form.append("entityId", fields.entityId.toString())
        }
        form.append("applicationId", fields.applicationId.toString())
        form.append("documentSubCategoryId", fields.documentSubCategoryId.toString())
        form.append("version", fields.version[0])
        req.body = form

        const header = form.getHeaders()

        apiController.initiateRequest(req, method, reqRoute, res, req.body, header)
      } else {
        res.end()
      }
    })
  } catch (e) {
    console.log(e)
  }
})

apiRouter.all('/service/s/:service?/:type?', (req, res) => {
  let reqRoute;
  const queryParams = req.query
  const { service, type } = req.params
  const data = req.body
  const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&')
  const { method } = req

  reqRoute = `${config.services[service].target}/`
  reqRoute = type ? `${reqRoute}${type}` : reqRoute
  reqRoute = queryString ? `${reqRoute}?${queryString}` : reqRoute

  apiController.initiateRequest(req, method, reqRoute, res, data)
})

apiRouter.get('/getSearchResults/:type?', (req, res) => {
  const queryParams = req.query
  const { type } = req.params
  const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&')
  const { method } = req

  apiController.initiateRequest(req, method, `${type}?${queryString}`, res)
})

apiRouter.get('/getSearchResult/:type?', (req, res) => {
  const queryParams = req.query
  const { type } = req.params
  const queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&')
  const { method } = req

  apiController.initiateRequest(req, method, `${type}?${queryString}`, res)
})

apiRouter.get('/getView/:type?/:stype?/:id?', (req, res) => {
  let reqRoute
  const { type, stype, id } = req.params
  const { method } = req

  reqRoute = (stype) ? type + '/' + stype : type

  if (id) {
    reqRoute = `${reqRoute}/${id}`
  }

  apiController.initiateRequest(req, method, reqRoute, res)
})


module.exports = apiRouter
