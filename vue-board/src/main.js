import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '../routes' //설정 라우터 호출

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  el : '#app',
  render: h => h(App),
  router            
})
