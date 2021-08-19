<template>
  <div class="schedule">
    <div class="selectSchedule">
      <!-- 장소선택 -->
      <div>
        도시: 
        <select name="placeList" v-model="place" id="">
          <option v-for="item in this.$store.state.place" :key="item.place_id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div>
        장소:
        <input list="attractionList" v-model="attraction" required>
          <datalist id="attractionList">
            <option v-for="item of observeAttraction" :value="item.attraction" :key="item.attraction"></option>
          </datalist>
      </div>
      <div>
        시작 시간: 
        <input type="datetime-local" v-model="startDateTime" max="9999-12-31T23:59" required>
      </div>
      <div>
        종료 시간: 
        <input type="datetime-local" v-model="endDateTime" max="9999-12-31T23:59" required>
      </div>
      <div>
        <button  v-on:click="addSchedule">등록</button>
      </div>
    </div>
    <div class="scheduleView" v-for="(schdule, i) in observeSchedule" :key="schdule.date">
      <div class="scheduleDate">
        {{ schdule.date }}
      </div>
      <div class="detailedSchdule" v-for="(item, j) in schdule.data" :key="item.startTime">
        <div class="scheduleTime">
          <div>{{ item.startTime }}</div>
          <div class="scheduleTimeTilde">~</div>
          <div>{{ item.endTime }}</div>
        </div>
        <div class="scheduleImage">
          <img :src="item.imageSrc">
          <small>{{ item.imageCopyright }}</small>
        </div>
        <div class="schedulePlaceAttraction">
          <div>{{ item.place }}</div>
          <div class="scheduleAttraction">
            {{ item.attraction }}
          </div>
          <div class="scheduleDescription">
            {{ item.description }}
          </div>
        </div>
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
        <i class="deleteBtn fas fa-trash-alt" @click="deleteSchedule(i, j)"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      place: "",
      attraction: "",
      startDateTime: "",
      endDateTime: "",
    }
  },
  computed: {
    observeAttraction() {
      return this.$store.state.attraction;
    },
    observeSchedule() {
      return this.$store.state.schedule;
    },
    // splitSchedule() {
    //   let arr = this.$store.state.schedule;
    //   // console.log(arr);
      
    //   for(let i = 0; i < arr.length; i++) {
    //     arr.sort((a, b) => {
    //       a.data[0].startDateTime - b.data[0].startDateTime;
    //     })
    //     // console.log(
    //     //   new Date(schedule.data[0].startDateTime) -
    //     //     new Date(schedule.data[0].startDateTime)
    //     // );
    //     // console.log(new Date(schedule.data[0].startDateTime));
    //     arr[i].data.sort(
    //       (a, b) => {
    //         a.startDateTime - b.startDateTime;
    //       }
    //     );
    //   }

    //   // console.log(arr);
    //   return arr;
    // },
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
      this.$store.commit('SET_SCHEDULE', obj)
      this.attraction = "";
      this.startDateTime = this.endDateTime;
      this.endDateTime = "";
    },
    deleteSchedule() {
      console.log(this);
    }
  },
  created() {
    this.$store.dispatch('FETCH_PLACE');
  },
}
</script>

<style>
/* .schedule {
  background-color: ivory;
} */

.selectSchedule {
  display: flex;
  padding: 5%;
  padding-bottom: 0;
}

.scheduleView {
  margin: 10%;
}

.scheduleDate {
  display: inline;
  margin: 5%;
  padding: 0.5% 4%;
  border-radius: 100px;
  color: white;
  font-size: 1.4rem;
  background-color: #333333;
}

.detailedSchdule {
  height: 13vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* text-align: center; */
  /* vertical-align: middle; */

  margin: 5%;
  padding: 5%;
  /* border: 1px solid #333333; */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 60%);
  background-color: #fcecec;
}

.scheduleTime {
  width: 10%;
  text-align: center;
  /* height: 50%; */
  /* margin-bottom: 15%; */
}

.scheduleTimeTilde {
  margin: 50% 0;
}

.scheduleImage {
  width: 35%;
  /* margin: 1%; */
  font-size: 80%;
  color: darkgray;
}

.scheduleImage img{
  height: 12vw;
  width: 100%;
  object-fit: cover;
}

.scheduleImage small {
  display: flex;
}

.schedulePlaceAttraction {
  width: 30%;
  /* margin: 1%; */
}

.scheduleAttraction {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 2% 0;
}

.scheduleDescription {
  overflow: hidden;
  font-size: 0.85rem;
  color: #3f3f3f;
  height: 10vw;
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

</style>