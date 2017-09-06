<template>
	<div id="wrapper" :class="{
		'large': ! isForm,
		'start-page': true
	}">
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Raleway:100,300,400,600,700,900" rel="stylesheet">

		<main>
			<loader
				:total-pages="maxPages"
				:current-page="page"
				v-if="loading"
			></loader>
			<div class="light h1 mega-font">Film <span>Finder</span></div>
			<div v-if="!results.length && !loading">
				<el-form ref="form">
					<div class="form-div" :style="{
						'height': ! isForm ? '0' : '317px'
					}">
						<el-form-item>
							<el-select v-model="URL" placeholder="Категория">
								<el-option
									v-for="category in categories"
									:key="category.href"
									:label="category.title"
									:value="`http://kinogo.club${category.href}`">
								</el-option>
							</el-select>
						</el-form-item>

						<label>From year</label>
						<el-form-item>
							<el-input v-model="minYear" placeholder="2000"></el-input>
						</el-form-item>

						<label>Min rate</label>
						<el-form-item>
							<el-input v-model="minRating"></el-input>
						</el-form-item>

						<label>Passings pages</label>
						<el-form-item>
							<el-slider v-model="maxPages" :show-tooltip="true" :format-tooltip="tooltip"></el-slider>
						</el-form-item>
					</div>

					<el-button type="primary" @click="start" size="large" v-if="!loading">{{ button }}</el-button>
				</el-form>

			</div>

			<results
				:results="results"
				:url="$config('url')"
			></results>

			<updater></updater>

			<!--<div class="table-responsive results-table" v-if="results.length">-->
				<!--<table class="table table-bordered">-->
					<!--<thead>-->
					<!--<th>Заголовок</th>-->
					<!--<th @click="sortRate" class="pointer">Рейтинг <i :class="{-->
                  <!--'fa': true,-->
                  <!--'fa-sort-asc': asc && asc !== null,-->
                  <!--'fa-sort-desc': ! asc && asc !== null-->
                <!--}"-->
																	 <!--aria-hidden="true"></i></th>-->
					<!--<th>Ссылка</th>-->
					<!--<th class="text-center">+</th>-->
					<!--</thead>-->

					<!--<tbody>-->
					<!--<tr v-for="film in results">-->
						<!--<td>{{ film.title }}</td>-->
						<!--<td>{{ film.rate }}</td>-->
						<!--<td><a href="#" @click.prevent="open(film.href)">Ссылка</a></td>-->
						<!--<td class="text-center"><button class="btn btn-success" @click="addToBookmarks(film)">+</button></td>-->
					<!--</tr>-->
					<!--</tbody>-->
				<!--</table>-->
			<!--</div>-->

			<!--<p v-if="results.length" class="text-center">-->
				<!--<button class="btn btn-danger" @click="clearTable()">Очистить таблицу</button>-->
			<!--</p>-->


			<!--<ul>-->
				<!--<li v-for="film in bookmarks"><a href="#" @click.prevent="open(film.href)">{{ film.title }}</a><button class="btn btn-sm btn-warning" @click="removeBookmark(film)">-</button></li>-->
			<!--</ul>-->

		</main>
	</div>
</template>

<script>
	import SystemInformation from './LandingPage/SystemInformation'
	import Parser from './parser'
	import Loader from './Loader'
	import Results from './Results'
	import Updater from './Updater'
	import { notify } from './helpers'

	export default {
		name: 'landing-page',
		components: { Loader, Results, Updater },

		data () {
			return {
				minYear: 2004,
				URL: this.$config('url'),
				maxPages: 3,
				minRating: 4.3,
				flows: 80,
				results: [],
				categories: [],
				page: 1,
				loading: false,
				asc: null,
				bookmarks: [],
				isForm: false
			}
		},

		computed: {
			category() {
				return this.categories.filter((object) => {
					return `${this.$config('url')}${object.href}` == this.URL;
				})[0].title;
			},
			button() {
				return this.isForm ? 'Search' : 'Start';
			},
		},

		methods: {
			open (link) {
				this.$electron.shell.openExternal(link)
			},

			start() {
				if (! this.isForm) {
				    this.isForm = ! this.isForm;
				    return;
				}
				this.page = 1;
				this.loading = true;
				let parser = new Parser(this, this.URL, this.minRating, this.minYear, this.maxPages, this.flows);
				parser.parse();
			},

			tooltip(val) {
				return Math.round(val);
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
			let parser = new Parser(this, this.$config('url'));
			parser.getCategories();
			Event.$on('finishCats', (res) => {
				this.categories = res;
				this.URL = `${this.$config('url')}${res[0].href}`;
			});
			Event.$on('pageChanged', page => this.page = page)
		}
	}
</script>
