import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

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
        let images = []
        Array.from(Array(files.length).keys()).map(x => {
          let file = files[x]
          if (file.type.substr(0, 6) == 'image/') {
            let dct = {
              'name': file.name,
              'fullName': file.lastModified + '__' + file.name,
              'size': file.size,
              'objects': [],
            }
            images.push(dct)
          }
        })
        state.images.push(...images)
      }
    }
  })

  export default store