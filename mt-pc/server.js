const { Nuxt, Builder } = require('nuxt')

const app = require('express')()

var proxyMiddleware = require('http-proxy-middleware')

var config = require('./nuxt.config')

// 我们用这些选项初始化 Nuxt.js：

const isProd = process.env.NODE_ENV === 'production'

const nuxt = new Nuxt({ dev: !isProd })

// 生产模式不需要 build

if (!isProd) {

  const builder = new Builder(nuxt)

  builder.build()

}



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

app.listen(3000)

console.log('Server is listening on http://localhost:3000')
