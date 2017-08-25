<template>
  <div id="wrapper">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300" rel="stylesheet">

    <h1 class="light mega-font">Мега парсер фильмов <small v-if="bookmarks.length">{{ bookmarks.length }} закладок</small></h1>
    <h3 v-if="results.length"><p class="text-info light">
      Найдено <i>{{ results.length }} фильмов</i> в категории <i>{{ category }}</i>,
      от <i>{{ minYear }} года</i> и с минимальным рейтингом <i>{{ minRating }}</i>
    </p></h3>
    <main>
      <loader v-if="loading"></loader>
      
      <div v-if="!results.length">
        <div class="form-group">
          <label>Категория</label>
          <select v-model="URL" class="form-control">
            <option :value="`http://kinogo.club${category.href}`" v-for="category in categories"
            >{{ category.title }}</option>
          </select>

          <label>Год</label>
          <input type="text" class="form-control" v-model="minYear">

          <label>Минимальный рейтинг</label>
          <input type="text" class="form-control" v-model="minRating">

          <label>Пройти страниц</label>
          <input type="text" class="form-control" v-model="maxPages">

          <!-- <label>Одновременных потоков</label>
          <input type="text" class="form-control" v-model="flows"> -->
          
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
            <th @click="sortRate" class="pointer">Рейтинг <i :class="{
                  'fa': true, 
                  'fa-sort-asc': asc && asc !== null,
                  'fa-sort-desc': ! asc && asc !== null
                }" 
              aria-hidden="true"></i></th>
            <th>Ссылка</th>
            <th class="text-center">+</th>
          </thead>

          <tbody>
            <tr v-for="film in results">
              <td>{{ film.title }}</td>
              <td>{{ film.rate }}</td>
              <td><a href="#" @click.prevent="open(film.href)">Ссылка</a></td>
              <td class="text-center"><button class="btn btn-success" @click="addToBookmarks(film)">+</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="results.length" class="text-center">
        <button class="btn btn-danger" @click="clearTable()">Очистить таблицу</button>
      </p>


      <ul>
        <li v-for="film in bookmarks"><a href="#" @click.prevent="open(film.href)">{{ film.title }}</a><button class="btn btn-sm btn-warning" @click="removeBookmark(film)">-</button></li>
      </ul>
     
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import Parser from './parser'
  import Loader from './Loader'
  import { notify } from './helpers'

  export default {
    name: 'landing-page',
    components: { Loader },

    data () {
      return {
        minYear: 2004,
        URL: 'http://kinogo.club',
        maxPages: 80,
        minRating: 4.3,
        flows: 80,
        results: [],
        categories: [],
        loading: false,
        asc: null,
        bookmarks: []
      }
    },

    computed: {
      category() {
        return this.categories.filter((object) => {
          return `http://kinogo.club${object.href}` == this.URL;
        })[0].title;
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
      },

      sortRate() {
        this.asc = this.asc === null ? false : !this.asc;
        if (! this.asc) {
          this.results.sort((a, b) => +(+a.rate < +b.rate) || +(+a.rate === +b.rate) - 1);
          return;
        }
        this.results.sort((a, b) => +(+b.rate < +a.rate) || +(+a.rate === +b.rate) - 1);
      },

      clearTable() {
        this.results = [];
        this.asc = null;
      },

      addToBookmarks(film) {
        this.$db.insert(film, (err, newFilm) => {
          notify('Добавлено', 'Добавлено в закладки');
          this.updateBookmarks();
        });
      },

      updateBookmarks() {
        this.$db.find({}, (err, bookmarks) => this.bookmarks = bookmarks );
      },

      removeAll() {
        this.$db.remove({ }, {}, (err, numRemoved) => {
          notify('Удалено', `Удалено ${numRemoved} записи!`);
          this.updateBookmarks();
        });
      },

      removeBookmark(film) {
        this.$db.remove({ _id: film._id }, {}, (err, numRemoved) => {
          notify('Удалено', `Закладка удалена!`);
          this.updateBookmarks();
        });
      }
    },

    created() {
      this.updateBookmarks();
      
      Event.$on('finish', (res) => {
        this.results = res;
        this.loading = false;

        this.sortRate();

        let myNotification = new Notification('Готово', {
          body: 'Найдено '+this.results.length+' результатов!'
        });
      });
    },
    mounted() {
      let parser = new Parser('http://kinogo.club/');
      parser.getCategories();
      Event.$on('finishCats', (res) => {
        this.categories = res;
        this.URL = `http://kinogo.club${res[0].href}`;
      })
    }
  }
</script>

<style>
  @font-face {
      font-family: 'amsdam_cyr-latregular';
      src: url('~@/assets/fonts/10200-webfont.woff2') format('woff2'),
           url('~@/assets/fonts/10200-webfont.woff') format('woff');
      font-weight: normal;
      font-style: normal;
  }
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Source Sans Pro', sans-serif;
  }

  h1.mega-font {
    font-family: 'amsdam_cyr-latregular', sans-serif;
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

  .pointer:hover {
    cursor: pointer;
    user-select: none;
  }

  .light {
    font-weight: 300;
  }

  table th {
    padding: 0 0 0 8px;
  }

  .btn {
    border-radius: 0 !important;
    transition: all ease 0.3s;
  }
</style>
