<template>
<div class="form box mt-3">
<h2 class="title has-text-primary is-size-4">Please confirm your votes before final submit!</h2>
<form action="" @submit.prevent="submitVotes">
    <votes-list-item v-for="vote in votesByVoter" :key="vote.id" :vote="vote" />
    <router-link to="/voting/presidents" @click.prevent="resetVotes" class="button is-primary mr-6 mt-6">cancel</router-link>
    <button type="submit" :class="[{'is-loading': loading}, 'button', 'is-primary', 'mt-6']">submit</button>
</form>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import VotesListItem from '../components/VotesListItem.vue';

export default {
    name: 'VotesList',
    computed: {
        ...mapGetters(['votesByVoter', 'loading']),
    },
    methods: {
        submitVotes() {
            this.$store.dispatch('submitVotes')
            .then(() => {
                this.$router.push({name: 'contestants'})
            })
            .catch(() => {
                this.$router.push({name: 'votingPresidents'})
            })
        },
        resetVotes() {
            this.$store.dispatch('resetVotes')
            .then(() => {
                this.$router.push({name: 'votingPresidents'})
            })
        }
    },
    components: {
        VotesListItem,
    }
}
</script>

<style lang="scss" scoped>
.form {
    width: 500px;
    margin: auto;
}
</style>