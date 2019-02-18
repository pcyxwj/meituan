'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _axios = require('../interface/utils/axios');

var _axios2 = _interopRequireDefault(_axios);

var _cart = require('../dbs/models/cart');

var _cart2 = _interopRequireDefault(_cart);

var _md = require('crypto-js/md5');

var _md2 = _interopRequireDefault(_md);

var _sign = require('./utils/sign');

var _sign2 = _interopRequireDefault(_sign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default({ prefix: '/cart' });

router.post('/create', async function (ctx) {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    };
  } else {
    var time = Date();
    var cartNo = (0, _md2.default)(Math.random() * 1000 + time).toString();
    var _ctx$request$body$par = ctx.request.body.params,
        id = _ctx$request$body$par.id,
        detail = _ctx$request$body$par.detail;

    var cart = new _cart2.default({ id: id, cartNo: cartNo, time: time, user: ctx.session.passport.user, detail: detail });
    var result = await cart.save();
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo
      };
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      };
    }
  }
});

router.post('/getCart', async function (ctx) {
  var id = ctx.request.body.id;

  try {
    var result = await _cart2.default.findOne({ cartNo: id });
    ctx.body = {
      code: 0,
      data: result ? result.detail[0] : {}
    };
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    };
  }
});

exports.default = router;