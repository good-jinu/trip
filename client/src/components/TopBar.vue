<template>
	<nav class="top">
		<span>LOGO</span>
		<MenuBox/>
	</nav>
</template>

<script>
import MenuBox from './Top/MenuBox.vue';

export default {
	components: {
		MenuBox
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
</style>
