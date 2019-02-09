'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var consola = require('consola');

var _require = require('nuxt'),
    Nuxt = _require.Nuxt,
    Builder = _require.Builder;

// const mongoose = require('mongoose')
// const bodyParser = require('koa-bodyparser')
// const session = require('koa-generic-session')
// const Redis = require('koa-redis')
// const json = require('koa-json')
// const dbConfig = require('./dbs/config.js')
// const passport = require('./interface/utils/passport.js')
// const users = require('./interface/users.js')

var app = new Koa();
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;

// app.keys=['mt', 'keyskeys']
// app.poxy = true
// app.use(session({key: 'mt',prefix: 'mt:uid', store: new Redis()}))
// app.use(bodyParser({
//   extendTypes:['json','form','text']
// }))
// app.use(json())

// mongoose.connect('mongodb://127.0.0.1:27017/student',{
//   useNewUrlParser: true
// })

// app.use(passport.initialize())
// app.use(passport.session())
// Import and Set Nuxt.js options
//let config = require('../nuxt.config.js')
var config = require('../../nuxt.config.js');
config.dev = !(app.env === 'production');

async function start() {
  // Instantiate nuxt.js
  var nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    var builder = new Builder(nuxt);
    await builder.build();
  }

  //   app.use(users.routes()).use(users.allowedMethods())
  // //路由要放在这之前，否则可能失效
  app.use(function (ctx) {
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset

    return new Promise(function (resolve, reject) {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, function (promise) {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject);
      });
    });
  });

  app.listen(port, host);
  consola.ready({
    message: 'Server listening on http://' + host + ':' + port,
    badge: true
  });
}

start();
