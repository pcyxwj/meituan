'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaRedis = require('koa-redis');

var _koaRedis2 = _interopRequireDefault(_koaRedis);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _users = require('../../server/dbs/models/users');

var _users2 = _interopRequireDefault(_users);

var _passport = require('../../server/interface/utils/passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../../server/dbs/config');

var _config2 = _interopRequireDefault(_config);

var _axios = require('../../server/interface/utils/axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let router = new Router({
//     prefix:'/users'
// })
//
// let Store = new Redis().client
//
// router.post('/signup',async(ctx)=>{
//     const {username, password, email, code} = ctx.request.body;
//     //验证码
//     if(code) {
//         const saveCode = await Store.hget('nodemail:${username}','code')
//         const saveExpire = await Store.hget('nodemail:${username}','expire')
//
//         if(code == saveCode) {
//             if(new Date().getTime() - saveExpire > 0) {
//                 ctx.body = {
//                     code: -1,
//                     msg: '验证码已过期'
//                 }
//                 return false
//             }
//         } else {
//             ctx.body = {
//                 code: -1,
//                 msg: '验证码错误'
//             }
//         }
//     } else {
//         ctx.body = {
//             code: -1,
//             msg: '请填写验证码'
//         }
//     }
//     //用户登录与注册
//     let user  = await User.find({
//         username
//     })
//
//     if(user.length) {
//         ctx.body = {
//             code: -1,
//             msg: '用户名已注册'
//         }
//         return
//     }
//     //注册新用户
//     let nuser = await User.create({
//         username,
//         password,
//         email
//     })
//     //判断注册是否成功
//     if(nuser) {
//         let res = await axios.post('/users/signin',{
//             username,
//             password
//         })
//         if(res.data && res.data.code === 0) {
//             ctx.body = {
//                 code: 0,
//                 msg: '注册成功',
//                 user: res.data.user
//             }
//         } else {
//             ctx.body = {
//                 code: -1,
//                 msg: 'error',
//             }
//         }
//     } else {
//         ctx.body = {
//             code: -1,
//             msg: '注册失败',
//         }
//     }
// })
//
// //判断登录是否成功
// router.post('/signin',async(ctx,next)=>{
//     return Passport.authenticate('local',function (err,user,info,status) {
//         if(err) {
//             ctx.body = {
//                 code: -1,
//                 msg: err
//             }
//         } else {
//             if(user) {
//                 ctx.body = {
//                     code: 0,
//                     msg: '登录成功',
//                     user
//                 }
//                 return ctx.login(user)
//             } else {
//                 ctx.body = {
//                     code: 1,
//                     msg: info
//                 }
//             }
//         }
//     })(ctx,next)
// })
//
//
// router.post('/verify',async(ctx,next)=>{
//     let username = ctx.request.body.username
//     const saveExpire = await Store.hget('nodemail:${username}','expire')
//     if(saveExpire&&new Date().getTime() - saveExpire < 0) {
//         ctx.body = {
//             code: -1,
//             msg: '验证请求过于频繁 '
//         }
//         return false
//     }
//     //发送邮件
//     let transporter = nodeMailer.createTransport({
//         service: 'qq',
//         host: Email.smtp.host,
//         port: 587,              //端口
//         secure: false,          //是否监听405端口
//         auth: {
//             user: Email.smtp.user,
//             pass: Email.smtp.pass
//         }
//     })
//
//     let ko = {
//         code: Email.smtp.code(),            //验证码
//         expire: Email.smtp.expire(),        //过期时间
//         email: ctx.request.body.email,      //发送的地址
//         user: ctx.request.body.username     //发送的用户名
//     }
//     let mailOptions = {
//         from: '"认证邮件" <${Email.smtp.user}>',
//         to: ko.email,
//         subject: '《美团》注册码',
//         html: '您在《美团》中注册，您的注册码是${ko.code}'
//     }
//     //发送邮件
//     await transporter.sendMail(mailOptions,(error,info)=>{
//         //发送出错
//         if(error) {
//             return console.log('error');
//         } else {
//          //发送成功，存储
//             Store.hmset('nodemail:${ko.user}','code', ko.code, 'expire', ko.expire, 'email', ko.email)
//         }
//     })
//     //接口响应
//     ctx.body = {
//         code: 0,
//         msg: '验证码已发送，可能会有延时，有效期一分钟'
//     }
// })
//
// //退出
// router.get('/exit',async(ctx,next)=>{
//     await ctx.logout()
//     if(!ctx.isAuthenicated()) {
//         ctx.body = {
//             code: 0
//         }
//     } else {
//         ctx.body = {
//             code: -1
//         }
//     }
// })
//
// //获取用户名
// router.get('/getUser',async(ctx)=>{
//     if(ctx.isAuthenicated()) {
//         const {username, email} = ctx.session.passport.user;
//         ctx.body = {
//             user: username,
//             email
//         }
//     } else {
//         ctx.body = {
//             user: '',
//             email: ''
//         }
//     }
// })
//
// export default router

var router = new _koaRouter2.default({ prefix: '/users' });

var Store = new _koaRedis2.default().client;

router.post('/signup', async function (ctx) {
  var _ctx$request$body = ctx.request.body,
      username = _ctx$request$body.username,
      password = _ctx$request$body.password,
      email = _ctx$request$body.email,
      code = _ctx$request$body.code;


  if (code) {
    var saveCode = await Store.hget('nodemail:' + username, 'code');
    var saveExpire = await Store.hget('nodemail:' + username, 'expire');
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        };
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    };
  }
  var user = await _users2.default.find({ username: username });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    };
    return;
  }
  var nuser = await _users2.default.create({ username: username, password: password, email: email });
  if (nuser) {
    var res = await _axios2.default.post('/users/signin', { username: username, password: password });
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      };
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    };
  }
});

router.post('/signin', async function (ctx, next) {
  return _passport2.default.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user: user
        };
        return ctx.login(user);
      } else {
        ctx.body = {
          code: 1,
          msg: info
        };
      }
    }
  })(ctx, next);
});

router.post('/verify', async function (ctx, next) {
  var username = ctx.request.body.username;
  var saveExpire = await Store.hget('nodemail:' + username, 'expire');
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    };
    return false;
  }
  var transporter = _nodemailer2.default.createTransport({
    service: 'qq',
    auth: {
      user: _config2.default.smtp.user,
      pass: _config2.default.smtp.pass
    }
  });
  var ko = {
    code: _config2.default.smtp.code(),
    expire: _config2.default.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  };
  var mailOptions = {
    from: '"\u8BA4\u8BC1\u90AE\u4EF6" <' + _config2.default.smtp.user + '>',
    to: ko.email,
    subject: '《慕课网高仿美团网全栈实战》注册码',
    html: '\u60A8\u5728\u300A\u6155\u8BFE\u7F51\u9AD8\u4EFF\u7F8E\u56E2\u7F51\u5168\u6808\u5B9E\u6218\u300B\u8BFE\u7A0B\u4E2D\u6CE8\u518C\uFF0C\u60A8\u7684\u9080\u8BF7\u7801\u662F' + ko.code
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    } else {
      Store.hmset('nodemail:' + ko.user, 'code', ko.code, 'expire', ko.expire, 'email', ko.email);
    }
  });
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  };
});

router.get('/exit', async function (ctx, next) {
  await ctx.logout();
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    };
  } else {
    ctx.body = {
      code: -1
    };
  }
});

router.get('/getUser', async function (ctx) {
  if (ctx.isAuthenticated()) {
    var _ctx$session$passport = ctx.session.passport.user,
        username = _ctx$session$passport.username,
        email = _ctx$session$passport.email;

    ctx.body = {
      user: username,
      email: email
    };
  } else {
    ctx.body = {
      user: '',
      email: ''
    };
  }
});

exports.default = router;