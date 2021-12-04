<template>
<div v-if="!hasContestants" class="conatiner mt-5 add-margin">
  <h2 class="subtitle has-text-danger notification is-danger-light">Sorry! There is no present contestant under <span class="is-capitalized">{{state}}</span></h2>
</div>
<div v-else class="container mt-5">
  <h2 class="title is-capitalized mb-0">{{state}} State Constituencies Election Result:</h2>
  <template v-for="constituency in constitutencies" :key="constituency.id">
    <h3 class="subtitle is-capitalized has-text-weight-bold my-0 pt-4">{{constituency}}</h3>
    <div class="flex-container">
      <div v-for="houseOfRep in houseOfRepsByConstitutency(constituency)" :key="houseOfRep.id" class="flex-item">
        <contestant-list-item v-bind="houseOfRep" />
      </div>
    </div>
  </template>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ContestantListItem from '../components/ContestantListItem.vue';

export default {
  name: 'ResultHouseOfReps',
  components: {
    ContestantListItem,
  },
  props: {
    state: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      constitutencies: [],
      houseOfReps: [],
      hasContestants: true,
    }
  },
  computed: {
    ...mapGetters(['contestants', 'voteStatus']),
  },
  watch: {
    state() {
      this.getContestantsFromStore()
      .then(() => {
        return this.getStatesFromStore()
      })
      .then(() => {
        this.constitutencies = this.$store.getters.dataByState(this.state, 'constituencies');
        this.hasContestants = this.contestantsExist();
      })
    },
  },
  created() { 
    this.getContestantsFromStore()
    .then(() => {
      return this.getStatesFromStore()
    })
    .then(() => {
      this.constitutencies = this.$store.getters.dataByState(this.state, 'constituencies');
      this.hasContestants = this.contestantsExist();
    })
  },
  methods: {
    ...mapActions(['getContestants', 'getSates']),
    houseOfRepsByConstitutency(constitutency) {
      return this.$store.getters.contestantsByPosition('house of representative', this.state, constitutency)
      .sort((a,b) => {
        return b.votes - a.votes;
      });
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
    },
    contestantsExist() {
      if (!this.$store.getters.contestantsByPosition('house of representative', this.state).length) return false;
      return true;
    }
  },
}
</script>

<style lang='scss' scoped>
.container {
  width: 80%;
  margin: 0px auto;

  &.add-margin {
    margin-bottom: 100px;
  }
}
h2.title {
  text-align: center;
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
.state {
  text-transform: uppercase;
  text-decoration: underline;
  font-size: 1.2em;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  letter-spacing: 0.4em;
}
.district {
  text-transform: capitalize;
  font-size: 1.2em;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  letter-spacing: 0.2em;
}
</style>