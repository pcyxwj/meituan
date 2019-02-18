//声明状态
const state = () => ({
  menu:[],
  hotPlace:[]
})

//创建一个提交
const mutations = {
  setMenu(state, val) {
    state.menu = val;
  },
  setHotPlace(state, val) {
    state.hotPlace = val;
  }
}

const action = {
  setMenu: ({
    commit
  }, menu) => {
    commit('setMenu',menu)
  },
  setHotPlace: ({
      commit
    }, hotPlace) => {
    commit('setHotPlace',hotPlace)
  }
}

export default {namespaced: true, state, mutations, action}
