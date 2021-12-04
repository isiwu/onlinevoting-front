<template>
  <div class="">
    <div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
    <div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
    <div class="container mt-5">
      <h2 class="title my-0 pt-4">Presidents</h2>
      <div class="flex-container">
        <template v-for="(president) in sortedPresidents" :key="president.id">
          <div class="flex-item">
            <contestant-list-item  v-bind="president" />
          </div>
        </template>
      </div>
      <template v-for="district in districts" :key="district">
      <h2 class="title my-0 pt-4">Senates: {{district}}</h2>
        <div class="flex-container">
          <div v-for="(senate) in senatesByDistrict(district)" :key="senate.id" class="flex-item">
            <contestant-list-item v-bind="senate" />
          </div>
        </div>
      </template>
      <template v-for="constituency in constituencies" :key="constituency">
      <h2 class="title my-0 pt-4">House of Representatives: {{constituency}}</h2>
        <div class="flex-container">
          <div  v-for="(rep) in houseOfRepsByConstituency(constituency)" :key="rep.id" class="flex-item">
            <contestant-list-item v-bind="rep" />
          </div>
        </div>
      </template>
    </div> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ContestantListItem from '../components/ContestantListItem.vue';

export default {
    name: 'ContestantList',
    data() {
      return {
        voterState: '',
        voterDistrict: '',
        voterConstitutency: '',
        districts: [],
        constituencies: [],
      }
    },
    computed: {
      ...mapGetters(['contestants']),
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
        },
    },
    created() {
      this.voterState = sessionStorage.getItem('state');
      this.voterDistrict = sessionStorage.getItem('district');
      this.voterConstitutency = sessionStorage.getItem('constitutency');

      this.getVoterDataByState();
     },
     watch: {
       contestants() {
         this.getVoterDataByState();
       }
     },
     beforeRouteLeave() {
      this.$store.dispatch("unsetNotification");
    },
    methods: {
      senatesByDistrict(district) {
        return this.$store.getters.contestantsByPosition('senate', this.voterState, district).sort((a,b) => b.votes - a.votes);
      },
      houseOfRepsByConstituency(constituency) {
        return this.$store.getters.contestantsByPosition('house of representative',this.voterState, constituency).sort((a, b) => b.votes - a.votes);
      },
      getVoterDataByState() {
        if (!this.$store.getters.statesUnderContestants.length) {
          this.$store.dispatch('getStates')
          .then(() => {
            this.districts = this.$store.getters.dataByVoterState(this.voterState,'districts');
            this.constituencies = this.$store.getters.dataByVoterState(this.voterState,'constituencies');
          });
        } else {
          this.districts = this.$store.getters.dataByVoterState(this.voterState,'districts');
          this.constituencies = this.$store.getters.dataByVoterState(this.voterState,'constituencies');
        }
      }
    },
    components: {
        ContestantListItem,
    }
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

  h2.title {
    @media screen and (max-width: 768px) {
      text-align: center;
    }
  }
}
</style>