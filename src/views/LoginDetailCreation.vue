<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div class="container mt-4">
  <form action="" @submit.prevent="submitDetails" @input.capture="clearInputErors" class="box">
    <h2 class="title">Sign Up</h2>
    <div class="field">
      <div class="control">
        <label for="email" class="label has-text-left">Email</label>
        <input v-model="fields.email" type="email" id="email" class="input" placeholder="email">
      </div>
      <p v-show="fieldsEmpty.email" class="has-text-danger">email empty!</p>
    </div>
    <div class="field">
      <div class="control">
        <label for="password" class="label has-text-left">Password</label>
        <input v-model="fields.password" type="password" id="password"
          placeholder="password" class="input">
      </div>
      <p v-show="fieldsEmpty.password" class="has-text-danger">password empty!</p>
    </div>
    <div class="field">
      <label for="confirm-password" class="label has-text-left">Confirm Password</label>
      <div class="control">
        <input v-model="fields.confirmPassword" type="password" 
          id="confirm-password" placeholder="confirm password"
          class="input"
          @input="checkPasswordMatch(fields.password, fields.confirmPassword)">
      </div>
      <p v-show="fieldsEmpty.confirmPassword">confirm password empty!</p>
      <p v-show="!passwordMatch" class="has-text-danger">password did not match!</p>
    </div>
    <button :class="[{'is-loading': loading, 'is-medium': loading}, 'button is-primary is-fullwidth block is-size-5']">Submit</button>
  </form>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'LoginDetailCreation',
    data() {
        return {
            fields: {
                email: '',
                password: '',
                confirmPassword: '',
            },
            fieldsEmpty: {
                email: false,
                password: false,
                confirmPassword: false,
            },
            passwordMatch: true,
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
    beforeRouteLeave(to, from, next) {
      if (!this.notificationSuccess) {
        this.$store.dispatch("unsetNotification");
      }

      next();
    },
    methods: {
        submitDetails() {
            if (this.isFieldEmpty(this.fields)) return;

            if (!this.checkPasswordMatch(this.fields.password, this.fields.confirmPassword)) return;

            let payload = {},
            vm = this;

            for (const field in this.fields) {
              if (Object.hasOwnProperty.call(this.fields, field)) {
                if (field === 'confirmPassword') {
                  continue;
                }

                payload[field] = this.fields[field];
              }
            }

            this.$store.dispatch('createLoginDetails', payload)
            .then(() => {
              this.$router.push({name: 'loginDetailsOk'});
            })
            .catch(() => {

              for (const field in this.fields) {
                if (Object.hasOwnProperty.call(this.fields, field)) {
                  this.fields[field] = vm.fields[field];
                }
              }

              this.$router.push({name: 'createLoginDetails'})
            })
        },
        isFieldEmpty(fields) {
            let emptyField = false;

            for (const field in fields) {
                if (Object.hasOwnProperty.call(fields, field)) {
                    if (!field) {
                        this.fieldsEmpty[field] = true;
                        emptyField = true;
                    }  
                }
            }

            return emptyField;
        },
        checkPasswordMatch(...args) {
          if (args[0] !== args[1]) {
            this.passwordMatch = false;
            return false;
          }

          this.passwordMatch = true;
          return true;
        },
        clearInputErrors() {
          for (const field in this.fields) {
            if (Object.hasOwnProperty.call(this.fields, field)) {
              if (this.fields[field]) {
                this.fieldsEmpty[field] = false;
              } 
            }
          }
        }
    }
}
</script>

<style lang="scss" scoped>
.container { 
  width: 400px;
  margin: 4px auto 10px;

  @media screen and (min-width: 577px) and (max-width: 991px) {
    width: 70%;
    margin: 4px auto 10px;
  }

  @media screen and (max-width: 576px) {
    width: 80%;
    margin: 4px auto 10px;
  }
}
</style>