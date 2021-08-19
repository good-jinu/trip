<template>
  <div class="full">
      <img class="mainImage" src="./images/mainImage.jpg" alt="">
      <div class="homeMain">
          <div div class="recommendBtn"
          v-for="item in this.$store.state.place"
          :key="item.place_id">
                <router-link :to="`/to/${item.name}`" tag="button" >
                    {{ item.name }}
                </router-link>
          </div>
      </div>
      <div>
          <!-- 사용방법 -->
      </div>
  </div>
</template>

<script>
export default {
    created() {
        this.$store.dispatch('FETCH_PLACE');
    },
}
</script>

<style>
.full {
    position: relative;
}

.mainImage{
width: 100%;
}

.homeMain {
    text-align: right;
    width: 100%;
    position: absolute;
    top: 3%;
    right: 3%;
}

.recommendBtn {
    display: inline;
}

.recommendBtn button {
    border: 1px solid rgba(0, 0, 0, 0);
    border-bottom: 2px solid black;
    background-color: rgba(0, 0, 0, 0);
    font-family: 'Recipekorea';
    text-transform: uppercase;
}

.recommendBtn button:hover {
    background-color: black;
    color: white;
    text-shadow: none;
}

@media screen and (max-width: 770px) {
	.recommendBtn button {
    font-size: 0.9rem;
    text-shadow: -0.5px 0 #D3D3D3, 0 0.5px #D3D3D3, 0.5px 0 #D3D3D3, 0 -0.5px #D3D3D3;
    padding: 1px 8px;
    }
}

@media screen and (min-width: 770px) {
	.recommendBtn button {
    font-size: 1.8rem;
    text-shadow: -1px 0 #D3D3D3, 0 1px #D3D3D3, 1px 0 #D3D3D3, 0 -1px #D3D3D3;
    padding: 1px 10px;
    }
}
</style>