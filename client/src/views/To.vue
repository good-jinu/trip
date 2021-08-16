<template>
  <div>
      <div class="toMain">
          <p>도시: {{ this.$store.state.place.name }}</p>
      </div>
      <div>
          <!-- 여행지추천 -->
      </div>
  </div>
</template>

<script>
export default {
    created() {
        const placeName = this.$route.params.place
        this.$store.dispatch('FETCH_PLACE', placeName);
    }
}
</script>

<style>

.toMain {
    width: 100%;
}

/* .main::before {
    content: "";
    display: block;
    padding-top: 15%;
} */
</style>