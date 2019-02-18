'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _axios = require('../interface/utils/axios');

var _axios2 = _interopRequireDefault(_axios);

var _sign = require('./utils/sign');

var _sign2 = _interopRequireDefault(_sign);

var _province = require('../dbs/models/province');

var _province2 = _interopRequireDefault(_province);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default({
  prefix: '/geo'
});

//获取位置信息
router.get('/getPosition', async function (ctx) {
  var _ref = await _axios2.default.get('http://cp-tools.cn/geo/getPosition?sign=' + _sign2.default),
      status = _ref.status,
      _ref$data = _ref.data,
      province = _ref$data.province,
      city = _ref$data.city;

  if (status === 200) {
    ctx.body = {
      province: province,
      city: city
    };
  } else {
    ctx.body = {
      province: '',
      city: ''
    };
  }
});
//获取省份
router.get('/province', async function (ctx) {
  var _ref2 = await _axios2.default.get('http://cp-tools.cn/geo/province?sign=' + _sign2.default),
      status = _ref2.status,
      province = _ref2.data.province;

  if (status === 200) {
    ctx.body = {
      province: province
    };
  } else {
    ctx.body = {
      province: []
    };
  }
});
//获取省份ID
router.get('/province/:id', async function (ctx) {
  var _ref3 = await _axios2.default.get('http://cp-tools.cn/geo/province/' + ctx.params.id + '?sign=' + _sign2.default),
      status = _ref3.status,
      city = _ref3.data.city;

  if (status === 200) {
    ctx.body = {
      city: city
    };
  } else {
    ctx.body = {
      city: []
    };
  }
});
//获取城市
router.get('/city', async function (ctx) {
  var _ref4 = await _axios2.default.get('http://cp-tools.cn/geo/city?sign=' + _sign2.default),
      status = _ref4.status,
      city = _ref4.data.city;

  if (status === 200) {
    ctx.body = {
      city: city
    };
  } else {
    ctx.body = {
      city: []
    };
  }
});

//获取热门城市
router.get('/hotCity', async function (ctx) {
  var _ref5 = await _axios2.default.get('http://cp-tools.cn/geo/hotCity?sign=' + _sign2.default),
      status = _ref5.status,
      hots = _ref5.data.hots;

  if (status === 200) {
    ctx.body = {
      hots: hots
    };
  } else {
    ctx.body = {
      hots: []
    };
  }
});
//获取菜单
router.get('/menu', async function (ctx) {
  var _ref6 = await _axios2.default.get('http://cp-tools.cn/geo/menu?sign=' + _sign2.default),
      status = _ref6.status,
      menu = _ref6.data.menu;

  if (status === 200) {
    ctx.body = {
      menu: menu
    };
  } else {
    ctx.body = {
      menu: []
    };
  }
});
exports.default = router;