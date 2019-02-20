import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'
import home from './modules/home'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    geo,
    home
  },
  actions: {
    async nuxtServerInit({
      commit
    }, {req, app}) {
      const {status:status1,data:{province, city}} = await app.$axios.get('/geo/getPosition')
      //在客户端做检查，为了安全起见做两次检查
      commit('geo/setPosition',status1 === 200?{city,province}:{city:'',province:''})

      const {status:status2,data:{menu}} = await app.$axios.get('/geo/menu')
      //在客户端做检查，为了安全起见做两次检查
      commit('home/setMenu',status2 === 200?menu:[])

      //热门地点
      const {status:status3,data:{result}}=await app.$axios.get('/search/hotPlace',{
        params:{
          city: sessionStorage.getItem("city").replace('市','')
        }
      })
      commit('home/setHotPlace',status3===200?result:[])
    }
  }
})

export  default store
