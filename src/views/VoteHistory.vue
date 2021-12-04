<template>
<div class="container my-6">
  <table class="table is-bordered is-large is-centered">
    <caption class="has-text-weight-bold is-capitalized is-size-5">This is your vote details</caption>
    <thead>
      <tr>
        <th class="has-text-primary">Position</th>
        <th class="has-text-primary">Candidate</th>
        <th class="has-text-primary">Party</th>
        <th class="has-text-primary">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vote in votes" :key="vote.id">
        <td class="has-text-left has-text-weight-bold subtitle is-capitalized">{{ vote.position }}</td>
        <td class="has-text-left">{{ vote.fullName }}</td>
        <td class="has-text-left">{{ vote.party.toUpperCase() }}</td>
        <td>{{ timeVoted }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'VoteHistory',
  data() {
    return {
      votes: []
    }
  },
  computed: {
    ...mapGetters(['voter']),
    timeVoted() {
      return `${new Date(this.voter.timeVoted).toLocaleTimeString()} ${new Date(this.voter.timeVoted).toLocaleDateString()}`
    }
  },
  created() {
    const id = sessionStorage.getItem('id');
    this.$store.dispatch('getVoterVotes', id)
    .then(() => {
      this.votes = this.$store.getters.votesByVoter;
    })
    .catch(() => {
      this.$router.push({name: 'home'});
    })
  }
}
</script>