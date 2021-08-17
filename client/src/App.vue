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
import { refresh_token } from './jslib/loginManager';

export default {
	components: {
		TopBar
	},

	beforeMount() {
		refresh_token()
		.then((val)=>{
			this.$store.dispatch('setUser',val);
		});
	},

	beforeUpdate() {
		refresh_token()
		.then((val)=>{
			this.$store.dispatch('setUser',val);
		});

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
