<template>
<div class="container mt-5">
  <h1 class="title has-text-centerd is-centerd">Presidents</h1>
  <div class="flex-container">
    <div class="flex-item" v-for="president in sortedPresidents" :key="president.id">
        <contestant-list-item  v-bind="president" />
      </div>
  </div>
</div>
</template>

<script>
import ContestantListItem from '../components/ContestantListItem.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'ResultPresidents',
    components: {
      ContestantListItem,
    },
    computed: {
      ...mapGetters(['contestants', 'voteStatus']),
      sortedPresidents() {
        return this.$store.getters.contestantsByPosition('president')
        .sort((a, b) => {
          return b.votes - a.votes;
        })
      }
    },
    created() {
      if (!this.$store.getters.contestants.length) {
        this.$store.dispatch('getContestants')
      }
    },
}
</script>
<style lang="scss" scoped>
.container {
  width: 80%;
  margin: 0 auto;

  .flex-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 991px) {
      justify-content: center;
      align-items: center;
    }
  }
}
</style>