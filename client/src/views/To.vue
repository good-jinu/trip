<template>
  <div class="to">
      <div class="toMain">
          <h2>{{ this.$route.params.place }}</h2>
          <router-link :to="`/schedule`" tag="button">일정 짜기</router-link>
      </div>
      <div class="recommendedAttraction" v-for="item in attractionList" v-bind:key="item.attracktion">
          <div class="toImage">
              <img :src="item.imageSrc">
              <small>이미지 출처: {{ item.imageCopyright }}</small>
          </div>
          <div class="toDescription">
              <h3>{{ item.attraction }}</h3>
              <div>{{ item.description }}</div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    computed: {
        attractionList() {
            return this.$store.state.attraction;
        }
    },
    created() {
        const placeName = this.$route.params.place
        this.$store.dispatch('FETCH_ATTRACTION', placeName);
    }
}
</script>

<style>
.toMain {
    font-family: 'Recipekorea';
    font-size: 2rem;
    text-align: center;
    text-transform: uppercase;
}

.toImage img {
    width: 100%;
    object-fit: cover;
}


.toImage small {
    color: darkgray;
    display: flex;
}

@media screen and (max-width: 770px) {
    .to {
        margin: 5%;
    }

    .toMain h2 {
        margin-bottom: 0;
    }

    .toMain button {
        margin-bottom: 5%;
    }

    .recommendedAttraction {
        display: block;
    }

	.toImage {
        width: 100%;
    }

    .toImage img {
        height: 50vw;
    }

    .toDescription {
        width: 100%;
    }
}

@media screen and (min-width: 770px) {
    .to {
        margin: 5% 10%;
    }

    .toMain {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .toMain h2 {
        grid-column: 2;
    }

    .toMain button {
        width: 80px;
        height: 40px;
        margin: 6%;
        justify-self: end;
        align-self: center;
    }

    .recommendedAttraction {
        display: flex;
    }

	.toImage {
        width: 50%;
        margin: 3%;
        margin-right: 1.5%;
    }

    .toImage img {
        height: 20vw;
    }

    .toDescription {
        width: 50%;
        margin: 3%;
        margin-left: 1.5%;
    }
}
</style>