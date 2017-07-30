
// -----------------------------------


const tress = require('tress');
const needle = require('needle');
const cheerio = require('cheerio');
const resolve = require('url').resolve;
// var fs = require('fs');





// console.log("\n\n----------------------------------\nПарсинг...");
// console.log(`Рейтинг не меньше...${minRating}, год не раньше ${minYear}. Максимум ${maxPages} страниц`);\


export default class Parser
{
    constructor(URL = 'http://kinogo.club/prikljuchenija/', minRating = 2, minYear = 2004, maxPages = 80) {
        this.URL = URL;
        this.minYear = minYear;
        this.maxPages = maxPages;
        this.minRating = minRating;
    }

    parse() {
        let results = [];
        let that = this;
        let page = 1;
        var q = tress(function(url, callback){
            needle.get(url, function(err, res){
                if (err) throw err;

                var $ = cheerio.load(res.body);

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
                            rate: $(this).find('.current-rating').text()
                        });
                    }

                });


                
                $('.bot-navigation>a').last().each(function() {
                    if (page < that.maxPages) {
                        q.push(resolve(that.URL, $(this).attr('href')));
                    }
                    page++;
                });

                callback();
            });
        }, 100);

        q.drain = function(){
            // console.log('Найдено '+ results.length +' результатов');
            // fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
            Event.$emit('finish', results);
            // console.log(results);
        }

        q.push(that.URL);
    }

    
}
