<template>
  <div class="test">
    
  </div>
</template>

<script>
  const { remote } = require('electron');
  const updater = remote.require('electron-simple-updater');

  export default {
    props: [],

    data() {
      return {
          version: '0.1.1',
          platform: null,
          notes: 'Заметки...',
          installUrl: 'http://test.com'
      };
    },

    mounted() {
      let that = this;
        
      updater.checkForUpdates();
      updater.on('update-available', meta => {
          that.notes = meta.notes;
          that.installUrl = meta.install;
          that.version = meta.version;
          that.openModal();
      });

      this.platform = updater.build;
      
    },

    methods: {
      openModal() {
        let that = this;
        const h = this.$createElement;
        
        this.$msgbox({
          title: 'Вышла новая версия =)',
          message: h('p', null, [
            h('div', null, `Внимание! Вышла новая версия программы: ${this.version}`),
            h('el-alert', { title: 'success alert', type:'success' }, that.notes)
          ]),
          confirmButtonText: 'Скачать обновление',
          showCancelButton: false,
          cancelButtonText: 'Отменить',
          closeOnClickModal: false,
          type: 'success'

        }).then(() => {
          
          this.$message({
            type: 'success',
            message: 'Осталось совсем немного =)'
          });

          setTimeout(() => that.$electron.shell.openExternal(that.installLinkFixed), 1000);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Обновление до новых версий очень важно =('
          });          
        });
      }
    },

    computed: {
        /**
         * Так как ссылка формируется неправильно,
         * нужно немного закостылять
         * @returns {string}
         */
      installLinkFixed() {
          return this.installUrl.replace('-Setup-', ' Setup ');
      }
    }
  }
</script>

<style scoped>
  
</style>
