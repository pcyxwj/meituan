//声明状态
const state = () => ({
  position: {}
})

//创建一个提交
const mutations = {
  setPosition(state, val) {
    state.position = val;
  }
}

const action = {
  setPosition: ({
    commit
  }, position) => {
    commit('setPosition',position)
  }
}

export default {namespaced: true, state, mutations, action}
