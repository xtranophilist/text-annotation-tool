import Vuex from 'vuex'
import Vue from 'vue'

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
    hasImage: (state) => (fullName) => {
      return state.images.find(image => image.fullName == fullName)
    }
  },
  mutations: {
    addFiles(state, files) {
      let images = []
      Array.from(Array(files.length).keys()).map(x => {
        let file = files[x]
        let fullName = file.lastModified + '__' + file.name
        if (!state.images.find(image => image.fullName == fullName) && file.type.substr(0, 6) == 'image/') {
          let dct = {
            'name': file.name,
            'fullName': fullName,
            'size': file.size,
            'objects': [],
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