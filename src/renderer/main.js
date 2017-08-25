import Vue from 'vue'
import axios from 'axios'

import db from './datastore'
import App from './App'
import store from './store'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

window.Event = new Vue();

Vue.prototype.$db = db

db.find({}, function (err, docs) {
	console.log(docs);
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
