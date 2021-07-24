const app = new Vue({
	el: '#app',
	data(){
		return {
			//You can change these to see them change on the page if you want
			name: 'Vue Interactive Demo Tutorial',
			demoData: 'Hi! I am some Vue data.',
			clickCount: 0,
    		favoriteSites: ['CodePen', 'GitHub', 'Codecademy', 'VueJS'],
			favoriteSitesDetails: [
				{name: 'CodePen', url: 'https://codepen.io'},
				{name: 'GitHub', url: 'https://github.com'}, 
				{name: 'Codecademy', url: 'https://www.codecademy.com'}, 
				{name: 'VueJS', url: 'https://vuejs.org'}
			],
			property: '{{property}}',
			isAlert: false,
			isValid: false,
			loading: true,
			rating: 3
		}
	},
	methods: {
		updateClickCount: function(){
			this.clickCount += 1;
		},
		adjustInputWidth: function(e){
			e.target.size = e.target.value.length;
		},
		selectThis: function(e){
			e.target.select();
		},
		toggleAlert: function(){
			this.isAlert = !this.isAlert;
		},
		toggleLoading: function(){
			this.loading = !this.loading;
		}
	},
	computed: {
		getClass: function(){
			return this.isAlert ? 'alert' : 'default';
		}
	}
});