<template>
  <div class="searchbox">
    <form @submit.prevent="handleSearch">
      <input type="text" placeholder="Search..." name="search"/>
      <input type="submit"/>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    handleSearch: function(event) {
      this.$router.push('/to/'+event.target.search.value);
    }
  }
}
</script>

<style>
</style>
