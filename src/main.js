import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    images: []
  },
  getters: {
    imagePaths: state => {
      return state.images
    },
    hasImage: (state) => (file) => {
      return state.images.find(image => image.fullName == file.lastModified + '__' + file.name)
    }
  },
  mutations: {
    addFiles(state, files) {
      let file = files[0]
      if (file.type.substr(0, 6)=='image/') {
        let dct = {}
        dct.fullName = file.lastModified + '__' + file.name
        dct.size = file.size
        state.images.push(dct)
      }
    }
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
