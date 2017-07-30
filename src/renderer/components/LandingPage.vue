<template>
  <div id="wrapper">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <h1>Мега парсер фильмов</h1>
    <h3 v-if="results.length">Найдено {{ results.length }} фильмов</h3>
    <main>
      <!-- <div class="left-side">
        <span class="title">
          Welcome to your new project!
        </span>
        <system-information></system-information>
      </div> -->
      
      <div v-if="!results.length">
        <div class="form-group">
          <label>URL</label>
          <input type="text" class="form-control" v-model="URL">

          <label>Год</label>
          <input type="text" class="form-control" v-model="minYear">

          <label>Минимальный рейтинг</label>
          <input type="text" class="form-control" v-model="minRating">

          <label>Пройти страниц</label>
          <input type="text" class="form-control" v-model="maxPages">

          <label>Одновременных потоков</label>
          <input type="text" class="form-control" v-model="flows">
          
        </div>

        <p>
          <button class="btn btn-success" @click="start" v-if="!loading">Начать!</button>
        </p>
      </div>
      
      <p class="text-center" v-if="loading">Парсинг...</p>
      
      <div class="table-responsive results-table" v-if="results.length">
        <table class="table table-bordered">
          <thead>
            <th>Заголовок</th>
            <th>Рейтинг</th>
            <th>Ссылка</th>
          </thead>

          <tbody>
            <tr v-for="film in results">
              <td>{{ film.title }}</td>
              <td>{{ film.rate }}</td>
              <td><a href="#" @click.prevent="open(film.href)">Ссылка</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="results.length" class="text-center">
        <button class="btn btn-danger" @click="results=[]">Очистить талицу</button>
      </p>
     
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import Parser from './parser'

  export default {
    name: 'landing-page',
    components: { SystemInformation },

    data () {
      return {
        minYear: 2004,
        URL: 'http://kinogo.club/prikljuchenija/',
        maxPages: 30,
        minRating: 4.3,
        flows: 80,
        results: [],
        loading: false
      }
    },

    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },

      start() {
          this.loading = true;
          let parser = new Parser(this.URL, this.minRating, this.minYear, this.maxPages, this.flows);
          parser.parse();
      }
    },

    created() {
      Event.$on('finish', (res) => {
        // alert('finish');
        // console.log(res);
        this.results = res;
        this.loading = false;

        let myNotification = new Notification('Готово', {
          body: 'Найдено '+this.results.length+' результатов!'
        });
      });
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .results-table {
    max-height: 400px;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
