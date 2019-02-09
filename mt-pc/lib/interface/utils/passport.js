'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _koaPassport = require('koa-passport');

var _koaPassport2 = _interopRequireDefault(_koaPassport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _users = require('../../dbs/models/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_koaPassport2.default.use(new _passportLocal2.default(async function (username, password, done) {
    var where = {
        username: username
    };
    var result = await _users2.default.findOne(where);
    if (result != null) {
        if (result.password === password) {
            return done(null, result);
        } else {
            return done(null, false, '密码错误');
        }
    } else {
        return done(null, false, '用户不存在');
    }
}));

_koaPassport2.default.serializeUser(function (user, done) {
    done(null, user);
});

_koaPassport2.default.deserializeUser(function (user, done) {
    return done(null, user);
});

exports.default = _koaPassport2.default;