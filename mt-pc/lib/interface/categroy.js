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

var router = new _koaRouter2.default({ prefix: '/categroy' });

router.get('/crumbs', async function (ctx) {

  // let result = await Categroy.findOne({city: ctx.query.city.replace('市', '') || '北京'})
  // if (result) {
  //   ctx.body = {
  //     areas: result.areas,
  //     types: result.types
  //   }
  // } else {
  //   ctx.body = {
  //     areas: [],
  //     types: []
  //   }
  // }

  var _ref = await _axios2.default.get('http://cp-tools.cn/categroy/crumbs', {
    params: {
      city: ctx.query.city.replace('市', '') || "北京",
      sign: _sign2.default
    }
  }),
      status = _ref.status,
      _ref$data = _ref.data,
      areas = _ref$data.areas,
      types = _ref$data.types;

  ctx.body = {
    areas: status === 200 ? areas : [],
    types: status === 200 ? types : []
  };
});

exports.default = router;