// css import
import 'element-ui/lib/theme-default/index.css'

// js import
import Vue from 'vue'
import ElementUI from 'element-ui'
import axios from 'axios'

import db from './datastore'
import App from './App'
import store from './store'
import router from './router'
import VueConfigManager from 'vue-config-manager'
import settings from './settings';
const { remote } = require('electron');
const updater = remote.require('electron-simple-updater');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

window.Event = new Vue();

Vue.prototype.$db = db

Vue.use(ElementUI);

Vue.use(VueConfigManager, settings);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')