import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import store from '../store'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    if(!el.value){
    el.focus()
  }
  }
})


new Vue({
  render: h => h(App),
  store
}).$mount('#app')
