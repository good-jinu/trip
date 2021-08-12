<template>
	<div id="App">
		<header>
			<TopBar/>
		</header>
		<section>
			<router-view></router-view>
		</section>
	</div>
</template>

<script>
import TopBar from './components/TopBar.vue';
import { getCookie } from '@/jslib/cookieIO.js';
import axios from 'axios';

export default {
	components: {
		TopBar
	},

	beforeMount() {
		var seToken=getCookie('sessionToken');
		if(seToken) {
			axios.get('/isOnline_process', {
				header: {
					'Authorization': seToken
				}
			})
			.then((res)=> {
				if(res.status===200) {
					console.log(res.data);
					this.$store.dispatch('setUser',{
						isLogin: true,
						isAdmin: res.data.authority_level>1,
						name: res.data.name
					})
				}
			})
			.catch((err) => {
				console.error(err);
			});
		}
	}
}
</script>

<style>
html, body {
	width: 100vw;
	min-height: 100vh;
	margin: 0;
}

#App {
  width: 100vw;
}
</style>
