import Vuex from 'vuex'
import Vue from 'vue'
// import { getBase64 } from './utils'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: null,
    images: []
  },
  getters: {
    imagePaths: state => {
      return state.images
    },
    hasImage: (state) => (id) => {
      return state.images.find(image => image.id == id)
    }
  },
  mutations: {
    addFiles(state, files) {
      let images = []
      Array.from(Array(files.length).keys()).map(x => {
        let file = files[x]
        let id = file.lastModified + '__' + file.size + '__' + file.name
        if (!state.images.find(image => image.id == id) && file.type.substr(0, 6) == 'image/') {
          let dct = {
            'name': file.name,
            'objects': [],
            'size': file.size,
            'id': id,
            'file': file,
            'suggestions': 0,
          }
          images.push(dct)
        }
      })
      if (images.length) {
        state.images.push(...images)
        if (!state.selected) {
          state.selected = images[0]
        }
      }
    },
    selectImage(state, img) {
      state.selected = img
    }
  }
})

export default store