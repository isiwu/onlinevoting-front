<template>
<contestant-ballot :contestants="sortedSenates" />
</template>

<script>
import { mapGetters } from 'vuex';
import ContestantBallot from '../components/ContestantBallot.vue';

export default {
    name: 'Senates',
    props: {
        state: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        }
    },
    computed: {
        ...mapGetters(['contestants','voteStatus']),
        sortedSenates() {
            return this.$store.getters.contestantsByPosition('senate', this.state, this.district.replace(/-/g, ' '))
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