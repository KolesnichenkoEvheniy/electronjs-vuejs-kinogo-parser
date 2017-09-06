<template>
	<el-row>
		<el-col :span="6" v-for="(o, index) in results" :key="index"
				:offset="(index > 0 && index % 3 != 0) ? 2 : 0">
			<el-card :body-style="{
				padding: '0px',
				height: '100%',
				display: 'flex',
				'flex-flow': 'column wrap'
			}">
				<img :src="`${url}${o.image}`" class="image image-spec" @click="open(o.href)">
				<div class="el-card__info-wrapper">
					<span v-text="o.title" class="text-span"></span>
					<div class="bottom clearfix">
						<el-rate
								v-model="o.rate"
								disabled
								show-text
								text-color="#ff9900"
								text-template="{value}">
						</el-rate>
						<hr>
						<span class="text-center">
							<el-button type="text" class="button" @click="open(o.href)">Watch film</el-button>
						</span>
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

<style scoped lang="scss">
	.text-center {
		display: flex;
		justify-content: center;
	}
	.el-col-1, .el-col-10, .el-col-11, .el-col-12, .el-col-13, .el-col-14, .el-col-15, .el-col-16, .el-col-17, .el-col-18, .el-col-19, .el-col-2, .el-col-20, .el-col-21, .el-col-22, .el-col-23, .el-col-24, .el-col-3, .el-col-4, .el-col-5, .el-col-6, .el-col-7, .el-col-8, .el-col-9 {
		float: none;
		margin-bottom: 66px;
	}

	.el-card {
		height: 100%;
		&__info-wrapper {
			flex-flow: column wrap;
			display: flex;
			width: 100%;
			flex-grow: 1;
			padding: 14px;
		}
	}

	.el-rate {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: row wrap;
	}

	.el-row {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		padding-top: 117px;

		&:before, &:after {
			display: none !important;
		}
	}

	.time {
		font-size: 13px;
		color: #999;
	}

	.text-span {
		flex-grow: 1;
		flex-flow: column wrap;
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