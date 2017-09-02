<template>
	<el-row>
		<el-col :span="6" v-for="(o, index) in results" :key="o" :offset="(index > 0 && index % 3 != 0) ? 2 : 0">
			<el-card :body-style="{ padding: '0px' }">
				<img :src="`${url}${o.image}`" class="image" @click="open(o.href)">
				<div style="padding: 14px;">
					<span v-text="o.title"></span>
					<div class="bottom clearfix">
						<el-button type="text" class="button" @click="open(o.href)">Watch film</el-button>
					</div>
				</div>
			</el-card>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		props: [
			'results',
			'url'
		],

		methods: {
			open (link) {
				this.$electron.shell.openExternal(link)
			},
		}
	}
</script>

<style scoped>
	.time {
		font-size: 13px;
		color: #999;
	}

	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}

	.button {
		padding: 0;
		float: right;
	}

	.image {
		width: 100%;
		display: block;
	}

	.image:hover {
		cursor: pointer;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}
</style>