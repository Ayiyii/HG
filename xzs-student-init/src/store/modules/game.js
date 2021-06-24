import Cookies from 'js-cookie'
import userApi from '@/api/game'
// initial state
const state = {
  point: ''
}

// actions
const actions = {
  initUserInfo ({ commit }) {
    userApi.getCurrentUser().then(re => {
      commit('setUserInfo', re.response)
    })
  },
  getUserMessageInfo ({ commit }) {
    userApi.getMessageCount().then(re => {
      commit('setMessageCount', re.response)
    })
  }
}

// mutations
const mutations = {
    changeValue(state,newVal){
        state.point=newVal
    },
    score(state,i,newVal){
      state.point[i].score=newVal
    },
  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo
    Cookies.set('studentUserInfo', userInfo, { expires: 30 })
  },
  setImagePath: (state, imagePath) => {
    state.imagePath = imagePath
    Cookies.set('studentImagePath', imagePath, { expires: 30 })
  },
  setMessageCount: (state, messageCount) => {
    state.messageCount = messageCount
  },
  messageCountSubtract: (state, num) => {
    state.messageCount = state.messageCount - num
  },
  clearLogin (state) {
    Cookies.remove('studentUserName')
    Cookies.remove('studentUserInfo')
    Cookies.remove('studentImagePath')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
