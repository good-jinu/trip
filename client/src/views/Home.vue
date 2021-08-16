<template>
  <div class="full">
      <div class="main">
          <div div class="recommendBtn"
          v-for="item in this.$store.state.places"
          :key="item.place_id">
                <router-link v-bind:to="`/to/${item.name}`" tag="button" >
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
html,
body,
div {
    width: 100%;
    height: 100%;
}
.main {
    width: 100%;
    background-size: cover;
    background-image: url(./images/korea-main.jpg);
    background-position: center center;
}

/* .main::before {
    content: "";
    display: block;
    padding-top: 100%; 
} */

.recommendBtn {
    display: inline;
}

.recommendBtn button {
    font-size: 25px;
    font-weight: 600;
    text-shadow: -1px 0 #D3D3D3, 0 1px #D3D3D3, 1px 0 #D3D3D3, 0 -1px #D3D3D3;
    margin: 1%;
    border-radius: 10px;
    border: 1px solid black;
    padding: 5px 30px;
    background-color: rgba(255, 355, 355, 0.3);
}
</style>