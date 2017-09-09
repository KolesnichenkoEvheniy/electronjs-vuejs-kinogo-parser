<template>
  <div class="version text-center">
    Version {{ version }}
  </div>
</template>

<script>
  const { remote } = require('electron');
  const updater = remote.require('electron-simple-updater');
  import { notify } from './helpers'

  export default {
    props: [],

    data() {
      return {
        version: 'dev'
      };
    },

    mounted() {
      let that = this;
      this.version = updater.version;
        
      updater.checkForUpdates();
      updater.on('update-available', meta => updater.downloadUpdate());

      updater.on('update-downloading', meta => {
          notify(that, `Внимание! Загружается новая версия программы: ${meta.version}`, 'info');
      });
      updater.on('update-downloaded', meta => {
          notify(that, `Сейчас программа будет перезапущена`, 'error');
          setTimeout(() => updater.quitAndInstall(), 1500);
      });
      
    }

  }
</script>

<style scoped>
  .version {
    color: #6f6c6c;
  }
</style>
