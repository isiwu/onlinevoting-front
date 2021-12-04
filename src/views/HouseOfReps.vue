<template>
<contestant-ballot :contestants="sortedHouseOfReps" />
</template>

<script>
import { mapGetters } from 'vuex';
import ContestantBallot from '../components/ContestantBallot.vue';

export default {
  name: 'HouseOfRep',
  props: {
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    constitutency: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['contestants', 'voteStatus']),
    sortedHouseOfReps() {
      return this.$store.getters.contestantsByPosition('house of representative', this.state, this.constitutency.replace(/-/g, ' '))
      .sort((a, b) => {
        return b.votes - a.votes;
      })
    }
  },
  components: {
    ContestantBallot,
  }
}
</script>