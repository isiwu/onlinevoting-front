<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div id="register-contestant">
  <div class="box mt-5">
    <form action="" @submit.prevent="registerContestant">
      <h2 class="title is-uppercase">register contestant</h2>
      <div class="field is-grouped" @change.capture="clearInputError">
        <div class="control is-expanded">
          <label for="fname">First Name</label>
          <input type="text" v-model="fields.firstName" id="fname" class="input" placeholder="first name" @input="clearInputError">
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.firstName">first name empty!</p>
        </div>
        <div class="control is-expanded">
          <label for="lname">Last Name</label>
          <input type="text" v-model="fields.lastName" id="lname" class="input" placeholder="last name" @input="clearInputError">
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.lastName">last name empty!</p>
        </div>
      </div>
      <div class="field" id="email" @change.capture="clearInputError">
        <div class="control">
          <label for="email" class="has-text-left">Email</label>
          <input type="text" v-model="fields.email" id="email" class="input" placeholder="email address"
        >
        </div>
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.email">email empty!</p>
      </div>
      <div class="field is-grouped" @change.capture="clearInputError">
        <div class="control is-expanded" id="state">
          <label for="state">State</label>
          <div class="select is-fullwidth">
          <select 
            v-model="fields.state" 
            id="state" 
            @change="getSelectionOptions">
            <option disabled value="">state</option>
            <option v-for="(state, index) in states" :value="state" :key="index">{{state}} State</option>
          </select>
          </div>
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.state">state empty!</p>
        </div>
        <div class="control is-expanded" id="district">
          <label for="district">Senatorial District</label>
          <div class="select is-fullwidth">
            <select 
              v-model="fields.district" 
              id="district" 
              :disabled="fields.state?false:true"
            >
              <option disabled value="">senatorial district</option>
              <option v-for="(district, index) in districts" :key="index" :value="district">{{district}}</option>
            </select>
          </div>
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.district">Senatorial district empty!</p>
        </div>
      </div>
      <div class="field is-grouped" @change.capture="clearInputError">
        <div class="control is-expanded" id="constituency">
          <label for="constituency">Constittuency</label>
          <div class="select is-fullwidth">
            <select 
              v-model="fields.constitutency" 
              id="constituency" 
              :disabled="fields.district?false:true"
            >
              <option disabled value="">constituency</option>
              <option v-for="(constitutency, index) in constitutencies" :key="index" :value="constitutency">{{constitutency}}</option>
            </select>
          </div>
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.constitutency">constituency empty!</p>
        </div>
        <div class="control is-expanded" id="local-govt">
          <label for="local-govt">Local Government</label>
          <div class="select is-fullwidth">
            <select 
              v-model="fields.localGovt" 
              id="local-govt" 
              :disabled="fields.constitutency?false:true"
            >
              <option disabled value="">local government</option>
              <option v-for="(localGovt, index) in localGovts" :value="localGovt" :key="index">{{localGovt}}</option>
            </select>
          </div>
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.localGovt">local govt empty!</p>
        </div>
      </div>
      <div class="field is-grouped" @change.capture="clearInputError">
        <div class="control is-expanded" id="position">
          <label for="position" class="">Position</label>
          <div class="select is-fullwidth">
            <select 
              v-model="fields.position" 
              id="position" 
              :disabled="fields.localGovt?false:true"
            >
              <option disabled value="">position</option>
              <option v-for="(position, index) in positions" :key="index" :value="position">{{position}}</option>
            </select>
          </div>
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.position">position empty!</p>
        </div>
        <div class="control is-expanded">
          <label for="party">Party</label>
          <div class="select is-fullwidth">
            <select 
              v-model="fields.party" 
              id="party" 
              :disabled="fields.position?false:true"
            >
              <option disabled value="">party</option>
              <option 
                v-for="(party, index) in parties" 
                :key="index" 
                :value="party">
                  {{party}}
              </option>
            </select>
          </div>
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.party">party empty!</p>
        </div>
      </div>
      
      <!-- <div v-if="!fields.image">
        <input type="file" ref="file" id="fileInput" @change="handleImage" style="display:none">
        <button @click.prevent="openFilePicker" class="button is-primary">add image</button>
        <p class="has-text-danger" v-show="fieldsEmpty.image">No image file!</p>
      </div>
      <div v-if="fields.image">
        <p><a class="button is-info is-small" @click.prevent="removeImage">remove image</a></p>
        <p><img :src="fields.image" alt="contestant" width="100"></p>
      </div> -->
      <button type="submit" :class="[{'is-loading':loading, 'is-medium':loading}, 'button is-primary is-fullwidth']">submit</button>
    </form>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'RegisterContestant',
    data() {
        return {
            fields: {
                firstName: '',
                lastName: '',
                email: '',
                state: '',
                position: '',
                district: '',
                constitutency: '',
                localGovt: '',
                party: '',
            },
            fieldsEmpty: {
                firstName: false,
                lastName: false,
                email: false,
                state: false,
                position: false,
                localGovt: false,
                party: false,
            },
            states: [],
            localGovts: [],
            positions: ['President', 'Senate', 'House of representative'],
            parties: [],
            districts: [],
            constitutencies: [],
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
      if (!this.$store.getters.states.length) {
        this.$store.dispatch('getStates')
        .then(() => {
          this.states = this.$store.getters.states;
        })
      } else {
        this.states = this.$store.getters.states;
      }

      if (!this.$store.getters.parties.length) {
        this.$store.dispatch('getParties')
        .then(() => {
          this.parties = this.$store.getters.parties;
        })
      } else {
        this.parties = this.$store.getters.parties;
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$store.dispatch("unsetNotification");
      next()
    },
    methods: {
        registerContestant() {
          if (this.inputError(this.fields)) return;

          const vm = this,
          payload = {};

          for (const field in this.fields) {
            if (Object.hasOwnProperty.call(this.fields, field)) {
              payload[field] = this.fields[field];
            }
          }
          
          this.$store.dispatch('registerContestant', payload)
          .then(() => {
            
            for (const field in this.fields) {
              if (Object.hasOwnProperty.call(this.fields, field)) {
                this.fields[field] = '';
              }
            }
            this.$router.push({name: 'registerContestant'});
          })
          .catch(() =>{
            for (const field in this.fields) {
              if (Object.hasOwnProperty.call(this.fields, field)) {
                vm.fields[field] = this.fields[field];
              }
            }
            
            this.$router.push({name: 'registerContestant'});
          })
        },
        getSelectionOptions() {
          let state = this.fields.state;
          if (state) {
            this.districts = this.$store.getters.dataByState(state, 'districts');
            this.constitutencies = this.$store.getters.dataByState(state, 'constituencies');
            this.localGovts = this.$store.getters.dataByState(state, 'localGovts')
          }

        },
        inputError(fields) {
          let error = false,
          fieldNames = Object.keys(fields); //Create array of field names

          //Loop through the fields to check if any is empty to show errors
          for (let i = 0; i < fieldNames.length; i++) {
            var field = fieldNames[i];

            if (!fields[field]) {
              this.fieldsEmpty[field] = true;
              error = true;
            }
          }

          return error;
        },
        clearInputError() {
          let fieldNames = Object.keys(this.fields);

          fieldNames.forEach(fieldName => {
            if (this.fields[fieldName]) this.fieldsEmpty[fieldName] = false;
          });
        },
    }
}
</script>

<style lang="scss" scoped>
#register-contestant {
  width: 50%;
  margin: auto;

  .box {
    border-top: 4px solid green;
  }
}
</style>