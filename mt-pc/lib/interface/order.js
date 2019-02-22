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

var _order = require('../dbs/models/order');

var _order2 = _interopRequireDefault(_order);

var _md = require('crypto-js/md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default({ prefix: '/order' });

router.post('/createOrder', async function (ctx) {
  var _ctx$request$body = ctx.request.body,
      id = _ctx$request$body.id,
      price = _ctx$request$body.price,
      count = _ctx$request$body.count;

  var time = Date();
  var orderId = (0, _md2.default)(Math.random() * 1000 + time).toString();

  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    };
  } else {
    var findCart = await _cart2.default.findOne({ cartNo: id });
    var order = new _order2.default({
      id: orderId,
      count: count,
      total: price * count,
      time: time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0
    });

    try {
      var result = await order.save();
      if (result) {
        await findCart.remove();
        ctx.body = {
          code: 0,
          id: orderId
        };
      } else {
        ctx.body = {
          code: -1
        };
      }
    } catch (e) {
      ctx.body = {
        code: -1
      };
    }
  }
});

router.post('/getOrder', async function (ctx) {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      list: [],
      msg: 'please login'
    };
  } else {
    try {
      var result = await _order2.default.find();
      if (result) {
        ctx.body = {
          code: 0,
          list: result
        };
      } else {
        ctx.body = {
          code: -1,
          list: []
        };
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        list: []
      };
    }
  }
});

exports.default = router;