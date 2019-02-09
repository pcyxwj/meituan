const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import Vue from 'vue'
import axios from 'axios'
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import dbConfig from './dbs/config.js'
import passport from './interface/utils/passport.js'
import users from '../components/public/users.js'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000


Vue.prototype.$axios = axios;

app.keys=['mt', 'keyskeys']
app.poxy = true
app.use(session({key: 'mt',prefix: 'mt:uid', store: new Redis()}))
app.use(bodyParser({
  extendTypes:['json','form','text']
}))
app.use(json())

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser: true
})

app.use(passport.initialize())
app.use(passport.session())
//Import and Set Nuxt.js options
let config = require('../../nuxt.config.js')
config.dev = !(app.env === 'production')

var proxyMiddleware = require('http-proxy-middleware')

// proxy api requests这里就是添加的proxyTable中间价的设置了
var proxyTable = config.dev.proxyTable

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(nuxt.render)//这里是添加nuxt渲染层服务的中间件

console.log('Server is listening on http://localhost:3000')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(users.routes()).use(users.allowedMethods())
//路由要放在这之前，否则可能失效
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: 'Server listening on http://${host}:${port}',
    badge: true
  })
}

start()