const tress = require('tress');
const needle = require('needle');
const cheerio = require('cheerio');
const resolve = require('url').resolve;

export default class Parser
{
    constructor(vue, URL = `${this.vue.$config('url')}/prikljuchenija/`, minRating = 2, minYear = 2004, maxPages = 80, flows = 80) {
        this.vue = vue;
        this.URL = URL;
        this.minYear = minYear;
        this.maxPages = maxPages;
        this.minRating = minRating;
        this.flows = flows;
    }

    parse() {
        let results = [];
        let that = this;
        let page = 1;
        let q = tress(function(url, callback){
            needle.get(url, function(err, res){
                if (err) throw err;

                let $ = cheerio.load(res.body);

                $('.shortstory').each(function(i, elem) {
                    if( 
                        $(this).find('h2 a').text().indexOf('сезон') === -1 && 
                        +$(this).find('.current-rating').text() >= that.minRating &&
                        +$(this).find('> div').eq(1).find('a').eq(1).text() >= that.minYear &&
                        $(this).find('> div').eq(1).text().indexOf('HDRip') !== -1
                        ) {

                        results.push({
                            title: $(this).find('h2 a').text(),
                            href: $(this).find('h2 a').attr('href'),
                            rate: +$(this).find('.current-rating').text(),
                            image: $(this).find('.shortimg div img').attr('src')
                        });
                    }

                });

                $('.bot-navigation>a').last().each(function(index, element) {
                    if ($(element).text() !== 'Позже') {
                        return false;
                    }
                    if (page < that.maxPages) {
                        q.push(resolve(that.URL, $(this).attr('href')));
                    }
                    page++;
					Event.$emit('pageChanged', page);
                });

                callback();
            });
        }, this.flows);

        q.drain = function(){
            Event.$emit('finish', results);
        };

        q.push(that.URL);
    }

    getCategories() {
        let categories = [];
        let that = this;
        let q = tress((url, callback) => {
            needle.get(url, (err, res) => {
                if (err) throw err;

                let $ = cheerio.load(res.body);

                $('.leftblok_contener2 > .leftblok1 > .miniblock > .mini > a').each((i, elem) => {
                    categories.push({
                        title: $(elem).text(),
                        href: $(elem).attr('href')
                    })
                });

                callback();
            });
        }, this.flows);

        q.drain = () => Event.$emit('finishCats', categories);

        q.push(that.URL);
    }
}