import Router from 'koa-router';
import axios from '../interface/utils/axios';
import sign from './utils/sign'
import Province from '../dbs/models/province';

let router = new Router({
  prefix: '/geo'
})

//获取位置信息
router.get('/getPosition', async(ctx) => {
  let {
    status,
    data: {
    province,
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`);
  if(status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})
//获取省份
router.get('/province', async(ctx) => {
  let{status,data: {province}} = await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`);
  if(status === 200) {
    ctx.body = {
      province
    }
  } else {
    ctx.body = {
      province: []
    }
  }
})
//获取省份ID
router.get('/province/:id', async(ctx) => {
  let {status,data:{city}} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`);
  if(status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})
//获取城市
router.get('/city', async(ctx) => {
  let {status,data:{city}} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`);
  if(status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

//获取热门城市
router.get('/hotCity', async(ctx) => {
  let{status, data:{hots}} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  if(status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})
//获取菜单
router.get('/menu', async(ctx) => {
  let {
    status,
    data: {
      menu
    }
  } = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`);

  if(status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})
export default router;
