<template>
<div class="">
  <h2 class="title">{{currentPosition}}</h2>
  <form action="" @submit.prevent="submitVote">
    <contestant-list-item v-for="contestant in contestants" :key="contestant.id" v-bind="contestant">
      <p class="field has-text-left">
        <span class="control">
          <label :for="contestant.id" class="label">
            vote
            <input type="checkbox" :id="contestant.id" :value="contestant.id" v-model="votes" class="checkbox" :checked="contestant.id===prevVoteId ? true:false" @change="voteSelected" :ref="contestant.party">
          </label>
        </span>
      </p>
    </contestant-list-item>
    <button class="button is-primary" :disabled="prevBtnDisabled" @click.prevent="$router.go(-1)">Prev</button>
    <button type="submit" class="button is-primary" :disabled="votes.length?false:true">Next</button>
  </form>
</div>
</template>

<script>
import ContestantListItem from './ContestantListItem.vue';

export default {
    name: 'ContestantBallot',
    props: ['contestants'],
    data() {
        return {
            votes: [],
            prevBtnDisabled: false,// Disable PREV button when on presidents view
            prevVoteId: null,
            currentPosition: '',
            voter: null,
            voterState: '',
            voterDistrict: '',
            voterConstitutency: '',
        }
    },
    created() {
        this.voterState = sessionStorage.getItem('state');
        this.voterDistrict = sessionStorage.getItem('district');
        this.voterConstitutency = sessionStorage.getItem('constitutency');
        
        //check the voter is going back or forward to remember his voter
        switch (this.$route.path) {
            case '/voting/presidents':
                this.prevBtnDisabled = true;
                this.currentPosition = 'president';
                this.previous('president');
                break;
            case `/voting/senates/${this.voterState.toLowerCase()}/${this.voterDistrict.toLowerCase().replace(/ /g, '-')}`:
                this.currentPosition = 'senate';
                this.previous('senate', this.voterState, this.voterDistrict);
                break;
            case `/voting/houseofreps/${this.voterState.toLowerCase()}/${this.voterDistrict.toLowerCase().replace(/ /g, '-')}/${this.voterConstitutency.toLowerCase().replace(/ |\//g, '-')}`:
                this.currentPosition = 'house of representative';
                this.previous('house of representative', this.voterState, this.voterDistrict, this.voterConstitutency);
                break;
            default:
                break;
        }
    },
    beforeRouteLeave() {
    this.$store.dispatch("unsetNotification");
  },
    methods: {
        submitVote() {
            if (!this.votes) return;

            //get the candidate that has this vote
            let contestant = this.contestants.find(contestant => contestant.id === this.votes[0]);

            /* Add vote to the store and navigate the voter to another  
               page.
            */
            this.$store.dispatch('addVote', contestant)
            .then(() => {
                let currentRoute = this.$route.path;

                //switch currentRoute to redirect to the next page and check for previous vote
                switch (currentRoute) { 
                    case '/voting/presidents':
                        this.$router.push({
                            name: 'votingSenates', 
                            params: {
                                state: this.voterState.toLowerCase(), 
                                district: this.voterDistrict.toLowerCase().replace(/ /g, '-')
                            }
                        })
                        .then(() => {
                            this.previous('senate', this.voterState, this.voterDistrict);
                        });
                        break;
                    case `/voting/senates/${this.voterState.toLowerCase()}/${this.voterDistrict.toLowerCase().replace(/ /g, '-')}`:
                        this.$router.push({
                            name: 'votingHouseOfReps', 
                            params: {
                                state: this.voterState.toLowerCase(),
                                constitutency: this.voterConstitutency.toLowerCase().replace(/ |\//g, '-'),
                            }
                        })
                        .then(() => {
                            this.previous('house of representative', this.voterState, this.voterConstitutency);
                        });
                        break;
                    case `/voting/houseofreps/${this.voterState.toLowerCase()}/${this.voterDistrict.toLowerCase().replace(/ /g, '-')}/${this.voterConstitutency.toLowerCase().replace(/ |\//g, '-')}`:
                        this.$router.push({name: 'confirmVotes'});
                        break;
                    default:
                        this.$router.push({name: 'contestants'});
                        break;
                }
            })
        },
        voteSelected(evt) {
            for (const ref in this.$refs) {
                if (this.$refs[ref] !== evt.target) {
                    this.$refs[ref].checked = false;
                }
                
            }

            evt.target.checked = true;
        },
        previous(position, ...args) {
            this.$store.getters.contestantsByPosition(position, ...args)
            .forEach(contestant => {
                if (this.$store.getters.votesByVoter.some(vote => vote.id === contestant.id)) {
                    this.prevVoteId = contestant.id;
                    this.votes[0] = contestant.id;
                }
            });
        }
    },
    components: {
        ContestantListItem,
    }
}
</script>

<style lang="scss" scoped>
.title {
    text-transform: uppercase;
}
</style>