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
	width: 100%;
	min-height: 100vh;
	margin: 0;
}

@font-face {
    font-family: 'Recipekorea';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/Recipekorea.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Recipekorea';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/Recipekorea.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>
