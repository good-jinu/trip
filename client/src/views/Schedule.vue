<template>
<div class="schedule">
  <modal v-if="showModal" @close="showModal = false">
    <h3 slot="header">
      경고!
      <i class="closeModalBtn fas fa-times" @click="showModal = false"></i>
    </h3>
    <div slot="body">
      모든 내용을 입력해주세요.
    </div>
  </modal>
  <div class="scheduleWidth">
    <div class="selectSchedule">
      <!-- 장소선택 -->
      <div class="selectSchedulePlace">
        도시: 
        <select name="placeList" v-model="place" id="">
          <option v-for="item in this.$store.state.place" :key="item.place_id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="selectScheduleAttraction">
        장소:
        <input list="attractionList" v-model="attraction" required>
          <datalist id="attractionList">
            <option v-for="item of observeAttraction" :value="item.name" :key="item.name"></option>
          </datalist>
      </div>
      <div class="selectScheduleStartTime">
        시작 시간: 
        <input type="datetime-local" v-model="startDateTime" max="9999-12-31T23:59" required>
      </div>
      <div class="selectScheduleEndTime">
        종료 시간: 
        <input type="datetime-local" v-model="endDateTime" max="9999-12-31T23:59" required>
      </div>
      <!-- <div class="selectScheduleAddBtn"> -->
        <i class="selectScheduleAddBtn fas fa-plus" v-on:click="addSchedule"></i>
        <!-- <button  v-on:click="addSchedule">등록</button> -->
      <!-- </div> -->
    </div>
    <div class="scheduleView" v-for="(schdule, i) in observeSchedule" :key="schdule.date">
      <div class="scheduleDate">
        {{ schdule.date }}
      </div>
      <div class="detailedSchdule" v-for="(item, j) in schdule.data" :key="item.startTime">
        <div class="scheduleTime">
          <div>{{ item.startTime }}</div>
          <!-- <div class="scheduleTimeTilde">~</div> -->
          <div class="scheduleEndTime">{{ item.endTime }}</div>
        </div>
        <div class="scheduleImage">
          <img :src="item.imageSrc">
          <small>{{ item.imageCopyright }}</small>
        </div>
        <div class="schedulePlace">
          {{ item.place }}
        </div>
        <div class="scheduleAttraction">
          {{ item.attraction }}
        </div>
        <div class="scheduleDescription">
          {{ item.description }}
        </div>
        <div class="deleteBtn">
          <i class="fas fa-trash-alt" @click="deleteSchedule(i, j)"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Modal from './common/Modal.vue'

export default {
  data: function(){
    return {
      place: "",
      attraction: "",
      startDateTime: "",
      endDateTime: "",
      showModal: false,
    }
  },
  computed: {
    observeAttraction() {
      return this.$store.state.attraction;
    },
    observeSchedule() {
      return this.$store.state.schedule;
    },
  },
  watch: {
    place: function (newPlace) {
      const place = newPlace;
      this.$store.dispatch('FETCH_ATTRACTION', place)
    },
  },
  methods: {
    addSchedule() {
      const obj = {
        place: this.place,
        attraction: this.attraction,
        startDateTime: this.startDateTime,
        endDateTime: this.endDateTime,
      }
      if(!(obj.place && obj.attraction && obj.startDateTime && obj.endDateTime)) {
        this.showModal = true;
        return
      }

      this.$store.commit('SET_SCHEDULE', obj)
      this.attraction = "";
      this.startDateTime = this.endDateTime;
      this.endDateTime = "";
    },
    deleteSchedule(dayIndex, timeIndex) {
      let payload = [dayIndex, timeIndex]
      this.$store.commit('DELETE_SCHEDULE', payload)
    }
  },
  created() {
    this.$store.dispatch('FETCH_PLACE');
  },
  components: {
    Modal
  }
}
</script>

<style>
.schedule {
  display: grid;
  justify-content: center;
}

.scheduleWidth {
  display: grid;
  grid-gap: 50px;
  padding-top: 5%;
}

.selectSchedule {
  display: grid;
  line-height: 150%;
}

.selectScheduleAddBtn {
  position: relative;
  font-size: 2rem;
  margin: auto;
}

.scheduleView {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 80px 1fr;
}

.scheduleDate {
  grid-column: 1;
  border-radius: 100px;
  color: white;
  font-size: 1.4rem;
  text-align: center;
  background-color: #333333;
}

.detailedSchdule {
  grid-column: 1 / 3;
  display: grid;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 60%);
}

.scheduleTime {
  line-height: 150%;
}

.scheduleEndTime {
  color: gray;
}

.scheduleImage {
  font-size: 80%;
  color: darkgray;
}

.scheduleImage img{
  object-fit: cover;
}

.scheduleImage small {
  display: flex;
}

.schedulePlace {
  font-family: 'Recipekorea';
  font-size: 0.8rem;
  text-transform: uppercase;
  font-style: italic;
  color: lightgray;
}

.scheduleAttraction {
  font-size: 1.2rem;
  font-weight: bold;
}

.scheduleDescription {
  font-size: 0.85rem;
  color: #3f3f3f;
  height: 100px;
}

.deleteButton {
  position: relative;
  width: 40px;
  height: 20px;
}

.deleteBtn {
  width: 3%;
  font-size: 1.2rem;
}

@media screen and (max-width: 770px) {
  .scheduleWidth {
    margin: 5vw;
    width: 90vw;
  }

  .selectSchedule {
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 28px;
    grid-auto-flow: column;
  }

  .selectScheduleStartTime {
    grid-row: 3;
    grid-column: 1/3;
  }

  .selectScheduleEndTime {
    grid-row: 4;
    grid-column: 1/3;
  }

  .detailedSchdule {
    padding: 5%;
    grid-template-columns: 53% 33% 10%;
    grid-template-rows: 3em 1fr 3em;
    grid-template-areas:
      "img  att   del"
      "img  desc  desc"
      "img  place  time";
    gap: 2%;
  }

  .scheduleTime {
    grid-area: time;
    align-self: flex-end;
    justify-self: end;
  }

  .scheduleImage {
    grid-area: img;
    line-height: 100%;
  }

  .scheduleImage img {
    width: 100%;
    height: 23vw;
  }

  .schedulePlace {
    grid-area: place;
    align-self: flex-end;
  }

  .scheduleAttraction {
    grid-area: att;
    word-break: keep-all;
  }
  
  .scheduleDescription {
    grid-area: desc;
    width: 100%;
    align-self: flex-end;
    max-height: 3.7em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .deleteBtn {
    grid-area: del;
    width: 100%;
    display: grid;
    justify-items: end;
  }
}

@media screen and (min-width: 770px) {
  .scheduleWidth {
    width: 730px;
    grid-template-rows: 50px auto;
  }

  .selectSchedule {
    gap: 10px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .detailedSchdule {
    grid-template-columns: 2fr 10fr 10fr 1fr;
    grid-template-rows: 30px 100px 10px;
    gap: 3%;
    padding: 5% 3%;
  }

  .scheduleTime {
    grid-row: 1 / 2;
  }

  .scheduleImage {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  .scheduleImage img {
    height: 120px;
    width: 270px;
  }

  .schedulePlace {
    grid-column: 3;
    grid-row: 3;
  }

  .scheduleAttraction {
    grid-row: 1;
  }

  .scheduleDescription {
    grid-column: 3;
    grid-row: 2;
  }
}
</style>