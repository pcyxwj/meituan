import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import User from '../dbs/models/users';
import Passport from '../interface/utils/passport';
import Email from '../dbs/config';
import axios from '../interface/utils/axios';

let router = new Router({
    prefix:'/users'
})

let Store = new Redis().client

router.post('/signup',async(ctx)=>{
    const {username, password, email, code} = ctx.request.body;
    //验证码
    if(code) {
        const saveCode = await Store.hget(`nodemail:${username}`,'code')
        const saveExpire = await Store.hget(`nodemail:${username}`,'expire')

        if(code == saveCode) {
            if(new Date().getTime() - saveExpire > 0) {
                ctx.body = {
                    code: -1,
                    msg: '验证码已过期'
                }
                return false
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '验证码错误'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '请填写验证码'
        }
    }
    //用户登录与注册
    let user  = await User.find({
        username
    })

    if(user.length) {
        ctx.body = {
            code: -1,
            msg: '用户名已注册'
        }
        return
    }
    //注册新用户
    let nuser = await User.create({
        username,
        password,
        email
    })
    //判断注册是否成功
    if(nuser) {
        let res = await axios.post('/signin',{
            username,
            password
        })
        if(res.data && res.data.code === 0) {
            ctx.body = {
                code: 0,
                msg: '注册成功',
                user: res.data.user
            }
        } else {
            ctx.body = {
                code: -1,
                msg: 'error',
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '注册失败',
        }
    }
})

//判断登录是否成功
router.post('/signin',async(ctx,next)=>{
    return Passport.authenticate('local',function (err,user,info,status) {
        if(err) {
            ctx.body = {
                code: -1,
                msg: err
            }
        } else {
            if(user) {
                ctx.body = {
                    code: 0,
                    msg: '登录成功',
                    user
                }
                return ctx.login(user)
            } else {
                ctx.body = {
                    code: 1,
                    msg: info
                }
            }
        }
    })(ctx,next)
})


router.post('/verify',async(ctx,next)=>{
    let username = ctx.request.body.username
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
    if(saveExpire&&new Date().getTime() - saveExpire < 0) {
        ctx.body = {
            code: -1,
            msg: '验证请求过于频繁 '
        }
        return false
    }
    //发送邮件
    let transporter = nodeMailer.createTransport({
        service: 'qq',
        host: Email.smtp.host,
        port: 587,              //端口
        secure: false,          //是否监听405端口
        auth: {
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })

    let ko = {
        code: Email.smtp.code(),            //验证码
        expire: Email.smtp.expire(),        //过期时间
        email: ctx.request.body.email,      //发送的地址
        user: ctx.request.body.username     //发送的用户名
    }
    let mailOptions = {
        from: `"认证邮件" <${Email.smtp.user}>`,
        to: ko.email,
        subject: '《美团》注册码',
        html: `您在《美团》中注册，您的注册码是${ko.code}`
    }
    //发送邮件
    await transporter.sendMail(mailOptions,(error,info)=>{
        //发送出错
        if(error) {
          console.log(ko.code);
          Store.hmset(`nodemail:${ko.user}`,'code', ko.code, 'expire', ko.expire, 'email', ko.email)
        } else {
         //发送成功，存储
            Store.hmset(`nodemail:${ko.user}`,'code', ko.code, 'expire', ko.expire, 'email', ko.email)
        }
    })
    //接口响应
    ctx.body = {
        code: 0,
        msg: '验证码已发送，可能会有延时，有效期一分钟'
    }
})

//退出
router.get('/exit',async(ctx,next)=>{
    await ctx.logout()
    if(!ctx.isAuthenticated()) {
        ctx.body = {
            code: 0
        }
    } else {
        ctx.body = {
            code: -1
        }
    }
})

//获取用户名
router.get('/getUser',async(ctx)=>{
    if(ctx.isAuthenticated()) {
        const {username, email} = ctx.session.passport.user;
        ctx.body = {
            user: username,
            email
        }
    } else {
        ctx.body = {
            user: '',
            email: ''
        }
    }
})

export default router

