<template>
	<!-- @click="gotoDatabaseEditer" -->
	<div>
		<LessonBriefEdit :id="id" @gotoDatabaseEditer="gotoDatabaseEditer"></LessonBriefEdit>
	</div>
</template>

<script>
     import LessonBriefEdit  from 'components/common/models/lessonBriefEdit'

	export default {
		components:{LessonBriefEdit},
		//data中放入属性，就像小程序中的data一样
		data() {
			return {
				// form: {
				// 	app_content_name: "",
				// 	price: null,
				// 	subject_dict_data_id: '',
				// 	term_dict_data_id: "",
				// 	target_dict_data_id: '',
				// 	app_desc: '',
				//     app_pic: '',									
				// },
				// checked:true,				
				// btnClick:false,
				// plusFlag:true,
				// fileList:[],
				// file:'',
				id:0
			}
		},
		//监听属性值的变化
		watch: {

		},
		// 所有的方法放在methods
		methods: {
			
			gotoDatabaseEditer() {
				// this.$router.push({path:'/manage/dataBaseEdit/funcManage',params:{id:1}})
				this.$router.push({
					// path: '/manage/dataBaseEdit/funcManage',
					// params:{id:1}
					name: 'wordsManage', params: { id: 0 }
				})
			},
			// createNewLessonCard(even){
			// 	this.btnClick=true;
			// 	if(this.form.price.indexOf("-")!=-1){
			// 		this.plusFlag=false
			// 	}
			// 	this.submitForm(even)

			// 	this.$refs.upload.submit();
			// },
		
		},
		// 所有的过滤器放在filters
		filters: {
			
		},
		//所有的data中的属性都可以二次格式化处理
		computed: {
			// 'form.textarea'() {
			// 	if (this.form.textarea.length > 500) {
			// 	return this.form.textarea=this.form.textarea.substring(0,501);
			// 	}
			// }
		},
		// DOM创建时,调用的钩子函数
		created() {
			
		},
		//页面加载完成时进行的回调
		mounted() {
	
		},
		//页面销毁时进行的回调
		destroyed() {
	
		}
	}
</script>

<style scoped>
	
</style>

