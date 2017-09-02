<template>
  <div id="wrapper">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Heebo:100|Raleway:100" rel="stylesheet">

    <div class="light h1 mega-font">Film <span>Finder</span> <small v-if="bookmarks.length">{{ bookmarks.length }} закладок</small></div>
    <h3 v-if="results.length"><p class="text-info light">
      Найдено <i>{{ results.length }} фильмов</i> в категории <i>{{ category }}</i>,
      от <i>{{ minYear }} года</i> и с минимальным рейтингом <i>{{ minRating }}</i>
    </p></h3>
    <main>
      <loader v-if="loading"></loader>

      <div v-if="!results.length">
        <!--<div class="form-group">-->
        <el-form ref="form" label-width="120px">
          <el-form-item label="Категория">
            <el-select v-model="URL" placeholder="Категория">
              <el-option
                  v-for="category in categories"
                  :key="category.href"
                  :label="category.title"
                  :value="`http://kinogo.club${category.href}`">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Год">
            <el-input v-model="minYear" placeholder="2000"></el-input>
          </el-form-item>

          <el-form-item label="Минимальный рейтинг">
            <el-input v-model="minRating"></el-input>
          </el-form-item>

          <el-form-item label="Пройти страниц">
            <el-input v-model="maxPages"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="start" size="large" v-if="!loading">Start</el-button>
          </el-form-item>
        </el-form>

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
