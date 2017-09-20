<template>
	<div id="wrapper" :class="{
		'large': ! isForm,
		'start-page': true
	}">
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css?family=Raleway:100,300,400,600,700,900" rel="stylesheet">

		<bookmarks></bookmarks>

		<main>
			<transition name="fade">
				<loader
					:total-pages="maxPages"
					:current-page="page"
					v-show="loading"
				></loader>
			</transition>

			<div :class="{
					'light h1 mega-font': true,
					'fidden': results.length
				}">
				<el-button type="primary" v-if="results.length" class="prev-button" icon="arrow-left"
						   @mouseover.native="textBack = true"
						   @mouseleave.native="textBack = false"
						   @click.native="clearTable()"
				>
					<span>Previous Page</span>
				</el-button>
				Film <span class="sub-logo">Finder</span>
			</div>
			<transition name="fade">
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
										:value="`${$config('url')}${category.href}`">
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
								<el-slider v-model="maxPages" :show-tooltip="true"></el-slider>
							</el-form-item>
						</div>

						<el-button type="primary" @click="start" size="large" v-if="!loading"
								   :loading="! buttonLoading && ! categories.length"
						>{{ button }}</el-button>
					</el-form>

				</div>
			</transition>

			<transition name="fade">
				<results
					v-if="results.length"
					:results="results"
					:url="$config('url')"
				></results>
			</transition>

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
	import Parser from './parser'
	import Loader from './Loader'
	import Results from './Results'
	import Updater from './Updater'
	import Bookmarks from './Bookmarks'
	import { notify } from './helpers'

	export default {
		name: 'main-page',
		components: { Loader, Results, Updater, Bookmarks },

		data () {
			return {
				minYear: 2004,
				URL: this.$config('url'),
				maxPages: 10,
				minRating: 4.3,
				flows: 80,
				results: [],
				categories: [],
				buttonLoading: true,
				page: 1,
				loading: false,
				asc: null,
				bookmarks: [],
				isForm: false,
				textBack: false
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
				if (this.buttonLoading) {
					let parser = new Parser(this, this.$config('url'));
					parser.getCategories();
					Event.$on('finishCats', (res) => {
						this.categories = res;
						this.URL = `${this.$config('url')}${res[0].href}`;
						this.isForm = ! this.isForm;
					});
					this.buttonLoading = ! this.buttonLoading;
					return;
				}
				this.loading = true;
				let parser = new Parser(this, this.URL, this.minRating, this.minYear, this.maxPages, this.flows);
				parser.parse();
				Event.$emit('start_progressbar');
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
		},

		created() {
			Event.$on('finish', res => {
				this.results = res;
				this.loading = false;
				this.sortRate();
				notify(this, `Найдено ${this.results.length} результатов!`);
				this.page = 1;
			});
		},
		mounted() {
			Event.$on('pageChanged', page => this.page = page)
		}
	}
</script>
