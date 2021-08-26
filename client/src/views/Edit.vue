<template>
	<article class="edit">
		<PlaceBoard/>
	</article>
</template>

<script>
import PlaceBoard from '@/components/editComp/PlaceBoard.vue';

export default {
	components: {
		PlaceBoard
	}
}
</script>

<style>
.edit {
	display: flex;
	width: 100%;
	min-height: 100%;
	flex-direction: column;
	align-items: center;
}
</style>
