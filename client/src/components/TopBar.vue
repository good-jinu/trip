<template>
	<nav class="top">
		<router-link to="/"><img src="./Top/LOGO.png" id="header-logo"/></router-link>
		<SearchBox/>
		<MenuBox/>
	</nav>
</template>

<script>
import MenuBox from './Top/MenuBox.vue';
import SearchBox from './Top/SearchBox';

export default {
	components: {
		MenuBox,
		SearchBox
	}
};
</script>

<style>
nav.top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(0.375turn, #fff 20%, #ffc3c3 65%, #c3c3ff 95%);
}

@media screen and (max-width: 770px) {
	nav.top {
		height: 70px;
	}
	#header-logo {
		width: 162px;
		height: 60px;
	}
}

@media screen and (min-width: 770px) {
	nav.top {
		height: 120px;
	}
	#header-logo {
		width: 270px;
		height: 100px;
	}
}
</style>
