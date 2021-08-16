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
import { getCookie, deleteCookie } from '@/jslib/cookieIO.js';
import axios from 'axios';

export default {
	components: {
		TopBar
	},

	beforeMount() {
		var seToken=getCookie('sessionToken');
		if(seToken) {
			axios.get('/isOnline_process', {
				headers: {
					'Authorization': seToken
				}
			})
			.then((res)=> {
				if(res.status===200 && res.data.isOnline) {
					this.$store.dispatch('setUser',{
						isLogin: res.data.isOnline,
						isAdmin: res.data.authority_level>1,
						name: res.data.name
					});
				} else {
					deleteCookie('sessionToken');
					this.$store.dispatch('setUser', {
						isLogin: false,
						isAdmin: false,
						name: ''
					});
				}
			})
			.catch((err) => {
				console.error(err);
				deleteCookie('sessionToken');
				this.$store.dispatch('setUser', {
					isLogin: false,
					isAdmin: false,
					name: ''
				});
			});
		}
	}
}
</script>

<style>
html, body, section {
	width: 100vw;
	min-height: 100vh;
	margin: 0;
}

#App {
  width: 100vw;
}
</style>
