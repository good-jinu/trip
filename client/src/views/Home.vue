<template>
  <div>
      <div class="main">
          <!-- <div v-for="item in this.$store.state.place" :key="item">
              <div>
                    <router-link v-bind:to="`/to/${item.name}`">
                        {{ item.name }}
                    </router-link>
              </div>
          </div> -->
          <div class="recommendBtn">
              <button>서울</button>
              <button>제주</button>
              <button>부산</button>
              <button>강릉</button>
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
.main {
    /* width: 100vw; */
    /* min-height: 100%; */
    background-size: cover;
    background-image: url(./images/korea-main.jpg);
    background-position: center center;
}

/* .main::before {
    content: "";
    display: block;
    padding-top: 100%; 
} */

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