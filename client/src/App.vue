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


export default {
	components: {
		TopBar
	}
}
</script>

<style>
html, body {
	width: 100vw;
	margin: 0;
}

#App {
  width: 100vw;
}
</style>
