<template>
  <div class="to">
      <div class="toMain">
          <h2>{{ this.$route.params.place }}</h2>
      </div>
      <div class="recommendedPlaces" v-for="item in placeItems" v-bind:key="item.place_id">
          <div class="toImage">
              <img :src="item.image">
              <small>이미지 출처: {{ item.imageSrc }}</small>
          </div>
          <div class="toDescription">
              <h3>{{ item.name }}</h3>
              <div>{{ item.description }}</div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    computed: {
        placeItems() {
            return this.$store.state.place;
        }
    },
    created() {
        const placeName = this.$route.params.place
        this.$store.dispatch('FETCH_PLACE', placeName);
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

    .recommendedPlaces {
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
    .recommendedPlaces {
        display: flex;
    }

	.toImage {
        width: 50%;
        margin: 3%;
        margin-right: 1.5%;
    }

    .toImage img {
        height: 25vw;
    }

    .toDescription {
        width: 50%;
        margin: 3%;
        margin-left: 1.5%;
    }
}
</style>