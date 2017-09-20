<template>
	<transition name="fade">
		<el-menu default-active="2" class="el-menu-vertical-demo" :collapse="true" v-if="bookmarks.length">
		  <el-submenu index="1">
		    <template slot="title">
		      <i class="el-icon-star-on"></i>
		    </template>
		      
		      <el-menu-item 
		      	v-for="(bookmark, index) in bookmarks"
		      	index="index"
		      	key="index"
		      	@click="open(bookmark.href)"
		      	>
		      	{{ bookmark.title }}
		      	<el-button type="text" icon="delete" @click.stop="removeBookmark(bookmark)"></el-button>
		      </el-menu-item>

		  </el-submenu>
		</el-menu>
	</transition>
</template>

<script>
    import { notify } from './helpers'

	export default {
		props: [ ],

        data () {
            return {
                bookmarks: [],
            }
        },

		methods: {
			open (link) {
				this.$electron.shell.openExternal(link)
			},

            updateBookmarks() {
                this.$db.find({}, (err, bookmarks) => this.bookmarks = bookmarks );

                Event.$emit('updateBookmarksResults');
            },

            removeBookmark(film) {
                this.$db.remove({ title: film.title }, {}, (err, numRemoved) => {
                    notify(this, `Закладка удалена!`);
                    this.updateBookmarks();
                });
            },
		},

		created() {
            this.updateBookmarks();
            Event.$on('updateBookmarks', () => this.updateBookmarks());
		}
	}
</script>

<style lang="scss" scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
	}
	ul.el-menu.el-menu-vertical-demo {
		padding-top: 20px;    
		position: fixed;
		top: 0;
		left: 0;
		height: auto;
		background: transparent;
	    z-index: 9;
	}
</style>