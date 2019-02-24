'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaGenericSession = require('koa-generic-session');

var _koaGenericSession2 = _interopRequireDefault(_koaGenericSession);

var _koaRedis = require('koa-redis');

var _koaRedis2 = _interopRequireDefault(_koaRedis);

var _koaJson = require('koa-json');

var _koaJson2 = _interopRequireDefault(_koaJson);

var _config = require('./dbs/config.js');

var _config2 = _interopRequireDefault(_config);

var _passport = require('./interface/utils/passport.js');

var _passport2 = _interopRequireDefault(_passport);

var _users = require('./interface/users');

var _users2 = _interopRequireDefault(_users);

var _geo = require('./interface/geo');

var _geo2 = _interopRequireDefault(_geo);

var _search = require('./interface/search');

var _search2 = _interopRequireDefault(_search);

var _categroy = require('./interface/categroy');

var _categroy2 = _interopRequireDefault(_categroy);

var _cart = require('./interface/cart');

var _cart2 = _interopRequireDefault(_cart);

var _order = require('./interface/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var consola = require('consola');

var _require = require('nuxt'),
    Nuxt = _require.Nuxt,
    Builder = _require.Builder;

var app = new Koa();
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;

_vue2.default.prototype.$axios = _axios2.default;

app.keys = ['mt', 'keyskeys'];
app.poxy = true;
app.use((0, _koaGenericSession2.default)({ key: 'mt', prefix: 'mt:uid', store: new _koaRedis2.default() }));
app.use((0, _koaBodyparser2.default)({
  extendTypes: ['json', 'form', 'text']
}));
app.use((0, _koaJson2.default)());

_mongoose2.default.connect(_config2.default.dbs, {
  useNewUrlParser: true
});

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
//Import and Set Nuxt.js options
var config = require('../nuxt.config.js');
config.dev = !(app.env === 'production');

var proxyMiddleware = require('http-proxy-middleware');
var proxyTable = config.dev.proxyTable;

async function start() {
  // Instantiate nuxt.js
  var nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    var builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(_users2.default.routes()).use(_users2.default.allowedMethods());
  app.use(_geo2.default.routes()).use(_geo2.default.allowedMethods());
  app.use(_search2.default.routes()).use(_search2.default.allowedMethods());
  app.use(_categroy2.default.routes()).use(_categroy2.default.allowedMethods());
  app.use(_cart2.default.routes()).use(_cart2.default.allowedMethods());
  app.use(_order2.default.routes()).use(_order2.default.allowedMethods());
  //路由要放在这之前，否则可能失效
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