import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import store from '../store'

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})


new Vue({
  render: h => h(App),
  store
}).$mount('#app')
