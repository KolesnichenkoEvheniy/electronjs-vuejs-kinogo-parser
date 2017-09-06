<template>
  <div class="box">
    <div class="cat">
      <div class="cat__body"></div>
      <div class="cat__body"></div>
      <div class="cat__tail"></div>
      <div class="cat__head"></div>
    </div>
    <progress-bar type="line" ref="line" :options="options"></progress-bar>
    <!--<el-progress :percentage="percentage"-->
                 <!--:status="status"-->
    <!--&gt;</el-progress>-->
  </div>
</template>

<script>
  export default {
  	data() {
      return {
		  start: 0,
		  timeOnePage: 0,
		  options: {
			  color: '#f7ba2a',
			  strokeWidth: 1,
		  },
		  start: true
      }
    },
    props: [
    	'currentPage',
        'totalPages'
    ],
    watch: {
		currentPage() {
			Event.$emit('finish_speed');
		}
	},
    computed: {
      percentage() {
      	return 100 * +this.currentPage / +this.totalPages;
      }
    },
    created() {

    },
    mounted() {
      Event.$on('start_progressbar', () => {
        this.$refs.line.set(0);
        this.timeOnePage = 0;

	  	Event.$emit('start_speed');
      })
		Event.$on('start_speed', () => {
			this.start = new Date();
			console.log('start');
		})
		Event.$on('finish_speed', () => {
//			if (! this.timeOnePage) {
				this.timeOnePage = new Date() - this.start;
//				console.log('end');
//
//				console.log([this.totalPages - this.currentPage,
//					this.totalPages, this.currentPage,
//					this.timeOnePage, this.options.duration]);

//			}
			this.options.duration = 0;
			this.options.duration = (this.totalPages - this.currentPage) * (this.timeOnePage / 2);
			this.$refs.line.animate(1.0, this.options);
		})
    }
  }
</script>

<style scoped>
  .cat {
    position: relative;
    width: 100%;
    max-width: 20em;
    overflow: hidden;
    background-color: #e6dcdc;
  }
  .cat::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
  .cat:hover > * {
    -webkit-animation-play-state: paused;
            animation-play-state: paused;
  }
  .cat:active > * {
    -webkit-animation-play-state: running;
            animation-play-state: running;
  }

  .cat__head, .cat__tail, .cat__body {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-animation: rotating 2.79s cubic-bezier(0.65, 0.54, 0.12, 0.93) infinite;
            animation: rotating 2.79s cubic-bezier(0.65, 0.54, 0.12, 0.93) infinite;
  }
  .cat__head::before, .cat__tail::before, .cat__body::before {
    content: '';
    position: absolute;
    width: 50%;
    height: 50%;
    background-size: 200%;
    background-repeat: no-repeat;
    background-image: url("https://images.weserv.nl/?url=i.imgur.com/M1raXX3.png&il");
  }

  .cat__head::before {
    top: 0;
    right: 0;
    background-position: 100% 0%;
    -webkit-transform-origin: 0% 100%;
            transform-origin: 0% 100%;
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg);
  }

  .cat__tail {
    -webkit-animation-delay: .2s;
            animation-delay: .2s;
  }
  .cat__tail::before {
    left: 0;
    bottom: 0;
    background-position: 0% 100%;
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    -webkit-transform: rotate(-30deg);
            transform: rotate(-30deg);
  }

  .cat__body {
    -webkit-animation-delay: .1s;
            animation-delay: .1s;
  }
  .cat__body:nth-of-type(2) {
    -webkit-animation-delay: .2s;
            animation-delay: .2s;
  }
  .cat__body::before {
    right: 0;
    bottom: 0;
    background-position: 100% 100%;
    -webkit-transform-origin: 0% 0%;
            transform-origin: 0% 0%;
  }

  @-webkit-keyframes rotating {
    from {
      -webkit-transform: rotate(720deg);
              transform: rotate(720deg);
    }
    to {
      -webkit-transform: none;
              transform: none;
    }
  }

  @keyframes rotating {
    from {
      -webkit-transform: rotate(720deg);
              transform: rotate(720deg);
    }
    to {
      -webkit-transform: none;
              transform: none;
    }
  }
  .box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-pack: start;
        -ms-flex-pack: start;
            justify-content: flex-start;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    background-color: #e6dcdc;
    position: fixed;
    z-index: 99;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    min-height: 100%;
    margin: 0;
    line-height: 1.4;
  }

  .intro {
    width: 90%;
    max-width: 36rem;
    padding-bottom: 1rem;
    margin: 0 auto 1em;
    padding-top: .5em;
    font-size: calc(1rem + 2vmin);
    text-transform: capitalize;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  .intro small {
    display: block;
    opacity: .5;
    font-style: italic;
    text-transform: none;
  }

  .info {
    margin: 0;
    padding: 1em;
    font-size: .9em;
    font-style: italic;
    font-family: serif;
    text-align: right;
    opacity: .5;
  }
  .info a {
    color: inherit;
  }
</style>
