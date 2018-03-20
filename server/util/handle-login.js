/**
 * 登录接口
 */
const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

router.post('/login', function(req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accesstoken
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accesstoken,
          loginName: result.data.loginname,
          id: result.data.id,
          avatarUrl: result.data.avatar_url
        }
        resp.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) {
        res.json({
          success: false,
          data: err.response
        })
      } else {
        next(err)
      }
    })
})

module.exports = router
