<template>
<div v-if="!hasContestants" class="conatiner mt-5 add-margin">
  <h2 class="subtitle has-text-danger notification is-danger-light">Sorry! There is no present contestant under <span class="is-capitalized mt-4 pt-4">{{state}}</span></h2>
</div>
<div v-else class="container mt-2"> 
  <h2 class="title is-capitalized mb-0">{{state}} senate</h2>
  <template class="" v-for="(district, index) in districts" :key="index">
    <h3 class="subtitle has-text-weight-bold my-0 pt-4">{{ district }}</h3>
    <div class="flex-container">
      <div class="flex-item" v-for="senate in senatesByState(district)" :key="senate.id">
        <contestant-list-item v-bind="senate" />
      </div>
    </div>
  </template>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ContestantListItem from '../components/ContestantListItem.vue';

export default {
    name: 'ResultSenates',
    components: {
        ContestantListItem,
    },
    props: {
        state: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
          districts: [],
          hasContestants: true,
        }
    },
    computed: {
        ...mapGetters(['contestants', 'voteStatus']),
        sortedSenates() {
            return this.$store.getters.contestantsByPosition('senate', this.state)
        },
    },
    created() {
      this.getContestantsFromStore()
      .then(() => {
        return this.getStatesFromStore()
      })
      .then(() => {
        this.hasContestants = this.contestantsExist();
      })
    },
    watch: {
      state() {
        this.getContestantsFromStore()
        .then(() => {
          return this.getStatesFromStore()
        })
        .then(() => {
          this.hasContestants = this.contestantsExist();
        })
      },
    },
    methods: {
      ...mapActions(['getContestants', 'getStates']),
      senatesByState(district) {
        return this.$store.getters.contestantsByPosition('senate', this.state, district)
        .sort((a, b) => {
          return b.votes - a.votes;
        })
      },
      contestantsExist() {
        if (!this.$store.getters.contestantsByPosition('senate', this.state).length) return false;
        return true;
      },
      getContestantsFromStore() {
        return new Promise((resolve) => {
          this.getContestants()
          .then(() => {
            resolve()
          })
        })
      },
      getStatesFromStore() {
        return new Promise((resolve) => {
          if (!this.$store.getters.states.length) {
            this.getStates()
            .then(() => {
              this.districts = this.$store.getters.dataByState(this.state,'districts');
              resolve();
            })
          } else {
            this.districts = this.$store.getters.dataByState(this.state,'districts');
            resolve();
          }
        })
      }
    },
}
</script>
<style lang="scss" scoped>
.container {
  width: 85%;
  margin: 0px auto;
}
h2.title {
  @media screen and (max-width: 991px) {
    text-align: center;
  }
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 991px) {
    justify-content: center;
    align-items: center;
  }

  h3.subtitle {
    @extend h2.title;
  }
}
</style>