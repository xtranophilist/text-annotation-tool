import Vuex from 'vuex'
import Vue from 'vue'
import VuexPersist from 'vuex-persist';

// import { getBase64 } from './utils'

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

const store = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
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
        if (file.type.substr(0, 6) == 'image/') {
          let id = file.lastModified + '__' + file.size + '__' + file.name
          let existing = state.images.find(image => image.id == id)
          if (existing) {
            existing.file = file
          } else {
            let dct = {
              'name': file.name,
              'size': file.size,
              'id': id,
              'file': file,
              'data': {}
            }
            images.push(dct)
          }
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