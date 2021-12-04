<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<contestant-ballot :contestants="sortedPresidents"></contestant-ballot>
</template>

<script>
import { mapGetters } from 'vuex';
import ContestantBallot from '../components/ContestantBallot.vue';

export default {
  name: 'Presidents',
  computed: {
    ...mapGetters(['contestants', 'voteStatus']),
    sortedPresidents() {
        return this.$store.getters.contestantsByPosition('president').sort((a, b) => {
            return b.votes - a.votes;
        })
    },
    notificationSuccess() {
      return this.$store.getters.notification?.success
    },
    notificationMessage() {
      return this.$store.getters.notification?.message
    }
  },
  components: {
    ContestantBallot,
  },
  beforeRouteLeave(to, from, next) {
    if (!this.notificationSuccess) {
      this.$store.dispatch("unsetNotification");
    }

    next();
  },
}
</script>