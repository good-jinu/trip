<template>
  <div class="full">
      <img class="image" src="./images/korea-main.jpg" alt="">
      <div class="homeMain">
          <div div class="recommendBtn"
          v-for="item in this.$store.state.places"
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
        this.$store.dispatch('FETCH_PLACES');
    },
}
</script>

<style>
.full {
    position: relative;
}

.image{
width: 100%;
}

.homeMain {
    width: 100%;
    position: absolute;
    bottom: 1%;
}

.recommendBtn {
    display: inline;
}

.recommendBtn button {
    margin: 1%;
    border-radius: 10px;
    border: 1px solid black;
    background-color: rgba(255, 355, 355, 0.3);
}

@media screen and (max-width: 770px) {
	.recommendBtn button {
    font-size: 1.5rem;
    font-weight: 600;
    text-shadow: -0.5px 0 #D3D3D3, 0 0.5px #D3D3D3, 0.5px 0 #D3D3D3, 0 -0.5px #D3D3D3;
    padding: 5px 15;
}
}

@media screen and (min-width: 770px) {
	.recommendBtn button {
    font-size: 2rem;
    font-weight: 600;
    text-shadow: -1px 0 #D3D3D3, 0 1px #D3D3D3, 1px 0 #D3D3D3, 0 -1px #D3D3D3;
    padding: 5px 30px;
}
}
</style>