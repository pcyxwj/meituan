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

var _poi = require('../dbs/models/poi');

var _poi2 = _interopRequireDefault(_poi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default({ prefix: '/search' });

router.get('/top', async function (ctx) {
  // try {
  //   let top = await Poi.find({
  //     'name': new RegExp(ctx.query.input),
  //     city: ctx.query.city
  //   })
  //   ctx.body = {
  //     code: 0,
  //     top: top.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }
  //     }),
  //     type: top.length ? top[0].type : ''
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     top: []
  //   }
  // }
  var _ref = await _axios2.default.get('http://cp-tools.cn/search/top', {
    params: {
      input: ctx.query.input,
      city: ctx.query.city,
      sign: _sign2.default
    }
  }),
      status = _ref.status,
      top = _ref.data.top;

  ctx.body = {
    top: status === 200 ? top : []
  };
});

router.get('/hotPlace', async function (ctx) {
  // let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  // try {
  //   let result = await Poi.find({
  //     city,
  //     type: ctx.query.type || '景点'
  //   }).limit(10)
  //
  //   ctx.body = {
  //     code: 0,
  //     result: result.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }
  //     })
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     result: []
  //   }
  // }
  //判断有没有ctx.store这个属性如果有直接从ctx.store.geo.position.city中获取
  var city = ctx.store ? ctx.store.geo.position.city : ctx.query.city;

  var _ref2 = await _axios2.default.get('http://cp-tools.cn/search/hotPlace', {
    params: {
      sign: _sign2.default,
      city: city
    }
  }),
      status = _ref2.status,
      result = _ref2.data.result;

  ctx.body = {
    result: status === 200 ? result : []
  };
});

router.get('/resultsByKeywords', async function (ctx) {
  var _ctx$query = ctx.query,
      city = _ctx$query.city,
      keyword = _ctx$query.keyword;

  var _ref3 = await _axios2.default.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city: city,
      keyword: keyword,
      sign: _sign2.default
    }
  }),
      status = _ref3.status,
      _ref3$data = _ref3.data,
      count = _ref3$data.count,
      pois = _ref3$data.pois;

  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200 ? pois : []
  };
});

router.get('/products', async function (ctx) {
  var keyword = ctx.query.keyword || '旅游';
  var city = ctx.query.city || '北京';

  var _ref4 = await _axios2.default.get('http://cp-tools.cn/search/products', {
    params: {
      keyword: keyword,
      city: city,
      sign: _sign2.default
    }
  }),
      status = _ref4.status,
      _ref4$data = _ref4.data,
      product = _ref4$data.product,
      more = _ref4$data.more;

  if (status === 200) {
    ctx.body = {
      product: product,
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    };
  } else {
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    };
  }
});

exports.default = router;