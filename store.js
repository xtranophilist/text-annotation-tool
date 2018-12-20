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
    },
    getImage: (state) => (id) => {
      return state.images.find(fl => fl.id == id)
    },
    countAnnotation: (state) => (id) => {
      return state.images.find(fl => fl.id == id)
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
            'size': file.size,
            'id': id,
            'file': file,
            'data': {}
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
    updateText(state, arr) {
      state.selected.data.objects.find(o => o.uid == arr[0]).text = arr[1]
    },
    selectImage(state, newImg) {
      state.selected = newImg
    }
  }
})

export default store