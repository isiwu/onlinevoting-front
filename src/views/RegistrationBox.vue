<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div id="voter-register-form" class="mt-2">
  <div class="box">
  <h2 class="title is-uppercase">voter registration form</h2>
  <form action="" @submit.prevent="registerVoter">
    <div class="field" @input.capture="clearErrorMessage">
      <label for="fname" class="label has-text-left">First Name <span class="has-text-danger is-size-5">*</span></label>
      <div class="control">
        <input type="text" v-model="fields.firstName" class="input" id="fname">
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.firstName">first name empty!</p>
      </div>
    </div>
    <div class="field" @input.capture="clearErrorMessage">
      <label for="lname" class="label has-text-left">Last Name <span class="has-text-danger is-size-5">*</span></label>
      <div class="control">
        <input type="text" v-model="fields.lastName" class="input" id="lname">
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.lastName">last name empty!</p>
      </div>
    </div>
    <div class="field">
      <div class="control is-expanded" @input.capture="clearErrorMessage">
        <label for="email" class="label has-text-left">Email <span class="has-text-danger is-size-5">*</span></label>
        <input type="text" v-model="fields.email" id="email" class="input" placeholder="email address">
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.email">email empty!</p>
      </div>
    </div>
    <div class="field" @input.capture="clearErrorMessage">
      <div class="control is-expanded">
        <label for="nin" class="label has-text-left">National Identity Number <span class="has-text-danger is-size-5">*</span></label>
        <input type="number" id="nin" placeholder="NIN" class="input" v-model="fields.nin" :class="{'is-danger':fieldsError.nin,'is-outlined':fieldsError.nin,'is-light':fieldsError.nin}">
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.nin">NIN empty!</p>
        <p class="has-text-danger has-text-left" v-show="fieldsError.nin">Incorrect NIN!</p>
      </div>
    </div>
    <div class="field">
      <div class="control is-expanded">
        <label for="dob" class="label has-text-left">Date of Birth <span class="has-text-danger is-size-5">*</span></label>
        <input type="date" id="dob" placeholder="date of birth" class="input" v-model="fields.dateOfBirth">
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.dateOfBirth">Date of birth empty!</p>
      </div>
    </div>
    <div class="field" @change.capture="clearErrorMessage">
      <div class="control is-expanded" id="state">
        <label for="state" class="label has-text-left">State <span class="has-text-danger is-size-5">*</span></label>
        <div class="select is-fullwidth">
        <select v-model="fields.state" id="state" @change="getSelectionOptions">
          <option disabled value="">state</option>
          <option v-for="(state, index) in states" :value="state" :key="index">{{state}} State</option>
        </select>
        </div>
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.state">state empty!</p>
      </div>
    </div>
    <div class="field">
      <div class="control is-expanded" id="district">
        <label for="district" class="label has-text-left">Senatorial District <span v-show="fields.state" class="has-text-danger is-size-5">*</span></label>
        <div class="select is-fullwidth">
          <select v-model="fields.district" id="district" :disabled="fields.state?false:true">
            <option disabled value="">senatorial district</option>
            <option v-for="(district, index) in districts" :key="index" :value="district">{{district}}</option>
          </select>
        </div>
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.district">senatorial district empty!</p>
      </div>
    </div>
    <div class="field" @change.capture="clearErrorMessage">
      <div class="control is-expanded" id="constituency">
        <label for="constituency" class="label has-text-left">Constituency <span v-show="fields.district" class="has-text-danger is-size-5">*</span></label>
        <div class="select is-fullwidth">
          <select v-model="fields.constitutency" id="constituency" :disabled="fields.district?false:true">
            <option disabled value="">constituency</option>
            <option v-for="(constituency, index) in constituencies" :key="index" :value="constituency">{{constituency}}</option>
          </select>
        </div>
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.constituency">constitutency empty!</p>
      </div>
    </div>
    <div class="field">
      <div class="control is-expanded" id="local-govt">
        <label for="local-govt" class="label has-text-left">Local Government <span v-show="fields.constitutency" class="has-text-danger is-size-5">*</span></label>
        <div class="select is-fullwidth">
          <select v-model="fields.localGovt" id="local-govt" :disabled="fields.constitutency?false:true">
            <option disabled value="">local government</option>
            <option v-for="(localGovt, index) in localGovts" :value="localGovt" :key="index">{{localGovt}}</option>
          </select>
        </div>
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.localGovt">local government empty!</p>
      </div>
    </div>
    <div class="float-left">
      <button class="button is-danger cancel"><router-link to="/">Cancel</router-link></button>
    </div>
    <div class="float-right">
      <button :class="[{'is-loading':loading, 'is-medium':loading}, 'button is-primary submit']">Next</button>
    </div>
  </form>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RegisterVoter',
  data() {
    return {
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        nin: '',
        state: '',
        district: '',
        constitutency: '',
        localGovt: '',
      },
      fieldsEmpty: {
        firstName: false,
        lastName: false,
        email: false,
        dateOfBirth: false,
        nin: false,
        state: false,
        district: false,
        constitutency: false,
        localGovt: false,
      },
      fieldsError: {
        email: false,
        nin: false,
        dateOfBirth: false,
      },
      states: [],
      districts: [],
      constituencies: [],
      localGovts: [],
    }
  },
  computed: {
    ...mapGetters(['loading']),
    notificationSuccess() {
      return this.$store.getters.notification?.success
    },
    notificationMessage() {
      return this.$store.getters.notification?.message
    }
  },
  created() {
    if (!this.$store.getters.statesUnderContestants.length) {
      this.$store.dispatch('getStates')
      .then(() => {
        this.states = this.$store.getters.statesUnderContestants;
      })
    } else {
      this.states = this.$store.getters.statesUnderContestants;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.notificationSuccess) {
      this.$store.dispatch("unsetNotification");
    }

    next();
  },
  methods: {
    registerVoter() {
      if (this.inputErrors(this.fields)) return;

      var vm = this,
      payload = {};

      for (const field in this.fields) {
        if (Object.hasOwnProperty.call(this.fields, field)) {
          payload[field] = this.fields[field];
        }
      }

      this.$store.dispatch('registerVoter', payload)
      .then(() => {
        for (let field in this.fields) {
          this.fields[field] = '';
        }

        this.$router.push({name: 'home'});
      })
      .catch(() => {

        for (const field in this.fields) {
          if (Object.hasOwnProperty.call(this.fields, field)) {
            this.fields[field] = vm.fields[field];
          }
        }
        
        this.$router.push({path: '/register-voter', query: {register: 'unsuccessful'}});
      })
    },
    getSelectionOptions() {
      let state = this.fields.state;
      if (state) {
        this.districts = this.$store.getters.dataByVoterState(state, 'districts');
        this.constituencies = this.$store.getters.dataByVoterState(state, 'constituencies');
        this.localGovts = this.$store.getters.dataByVoterState(state, 'localGovts')
      }
    },
    inputErrors(fields) {
      let error = false;

      for (const field in fields) {
        if (Object.hasOwnProperty.call(fields, field) && !fields[field]) {
          if (field === 'nin') {
            if (fields[field].length !== 11) {
              this.fieldsError[field] = true;
              error = true;
              continue;
            }
          }
          this.fieldsEmpty[field] = true;
          error = true;
        }
      }

      return error;
    },
    clearErrorMessage() {

      for (const field in this.fields) {
        if (Object.hasOwnProperty.call(this.fields, field) && this.fields[field]) {
          this.fieldsEmpty[field] = false;
          
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#voter-register-form {
  width: 50%;
  margin: auto;
  
  .box {
    border-top: 6px solid #000;
    padding-bottom: 60px;

    @media screen and (max-width: 576px) {
      padding-bottom: 25px;
    }
  }

  @media screen and (max-width: 991px) {
    width: 80%;
    margin: auto;
  }

  .float-left {
    float: left;

    a {
      color: #fff;
      
      &:hover {
        font-size: 1.2rem;
      }
    }
  }
  
  .float-right {
    float: right;
    
    button:hover {
      font-size: 1.2rem;
    }
  }

  @media screen and (max-width: 576px) {
    .float-left, .float-right {
      float: none;
      margin-top: 10px;
    }

    button {
      width: 100%;
    }
  }

}
</style>