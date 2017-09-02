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

// setText('version', updater.version);
// setText('build', updater.buildId);
// attachUiHandlers();
// attachUpdaterHandlers();

// function attachUiHandlers() {
//   const btnUpdate        = document.getElementById('btn-update');
//   const btnInstall       = document.getElementById('btn-install');
//   const chkAutomatically = document.getElementById('automatically');

//   btnUpdate.addEventListener('click', () => {
//     updater.checkForUpdates();
//     document.body.classList.add('update-downloading');
//   });

//   btnInstall.addEventListener('click', () => {
//     updater.downloadUpdate();
//   });

//   chkAutomatically.addEventListener('change', function() {
//     updater.setOptions('autoDownload', this.checked);
//   });
// }

// function attachUpdaterHandlers() {
//   updater.on('update-available', onUpdateAvailable);
//   updater.on('update-downloading', onUpdateDownloading);
//   updater.on('update-downloaded', onUpdateDownloaded);
//   updater.setOptions('logger', {
//     info(text) { log('info', text); },
//     warn(text) { log('warn', text); }
//   });

//   function onUpdateAvailable(meta) {
//     setText('new-version', meta.version);
//     setText('description', meta.readme);
//     document.body.className = 'update-available';
//   }

//   function onUpdateDownloading() {
//     document.body.classList.add('update-downloading');
//   }

//   function onUpdateDownloaded() {
//     if (window.confirm('The app has been updated. Do you like to restart it now?')) {
//       updater.quitAndInstall();
//     }
//   }

//   function log(level, text) {
//     const logMessages = document.getElementById('log-messages');
//     const p = document.createElement('p');
//     p.appendChild(document.createTextNode(`[${level}] ${text}`));
//     logMessages.appendChild(p);
//   }
// }

// function setText(id, text) {
//   document.getElementById(id).appendChild(
//     document.createTextNode(text)
//   );
// }