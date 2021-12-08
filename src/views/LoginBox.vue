<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div id="login-form" class="box mt-5">
  <h2 class="login-details">login</h2>
  <form action="" @submit.prevent="login" @input.capture="clearErrorMessage">
    <div class="field">
      <label for="" class="label has-text-left">Email Address</label>
      <div class="control has-icons-left">
        <input type="text" v-model="fields.email" placeholder="email" class="input">
        <span class="icon is-left">
          <i class="fas fa-user is-small"></i>
        </span>
      </div>
      <span v-if="emailEmpty" class="has-text-danger">email must not be empty!</span>
    </div>
    <div class="field">
      <label for="" class="label has-text-left">Password</label>
      <div class="control has-icons-left">
        <input type="password" v-model="fields.password" placeholder="password" class="input">
        <span class="icon is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <span v-if="passwordEmpty" class="has-text-danger">password must not be empty!</span>
    </div>
    <button :class="[{'is-loading': loading, 'is-medium': loading}, 'button is-primary is-fullwidth block']">Login</button>
    <div class="pb-4">
      <span class="is-left">
        Don't have an accout? <router-link to="/create-account" class="register">Register</router-link>
      </span>
      <router-link v-if="!maxAttemptsReached" to="/forget-password" class="is-right">Forgot Password</router-link>
      <router-link v-else to="/unlock-account" class="is-right">Unlock Acccount</router-link>
    </div>
  </form>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Login',
    data() {
        return {
          fields: {
            email: '',
            password: ''
          },
          emailEmpty: false,
          passwordEmpty: false,
          maxAttemptsReached: false,
          forgetPassword: false,
          hideNotification: false,
        }
    },
    computed: {
      ...mapGetters(['voter','voterAccount', 'loading']),
      notificationSuccess() {
        return this.$store.getters.notification?.success
      },
      notificationMessage() {
        return this.$store.getters.notification?.message
      }
    },
    watch: {
      voterAccount() {
        if (this.voterAccount.attempts === 3) {
          this.maxAttemptsReached = true;
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      if (!this.notificationSuccess) {
        this.$store.dispatch("unsetNotification");
      }

      next();
    },
    methods: {
        login() {
            if (this.validateInputs(this.fields)) {
              return;
            }

            var vm = this;
            this.$store.dispatch('login', {email: vm.fields.email, password: vm.fields.password})
            .then(() => {
              this.$router.push({name: 'home'});
            })
            .catch(() => {
              this.fields.email = vm.fields.email;
              this.fields.password = vm.fields.password;
              this.$router.push({name: 'login'});
            })
        },
        validateInputs(fields) {
          let error = false;

          if (!fields.email) {
            this.emailEmpty = true;
            error = true;
          }

          if (!fields.password) {
            this.passwordEmpty = true;
            error = true;
          }

          return error;
        },
        clearErrorMessage() {
          if (this.fields.email) this.emailEmpty = false;
          if (this.fields.password) this.passwordEmpty = false;
        },
    }
}
</script>
<style lang="scss" scoped>
.login-details {
  text-align: center;
  font-size: 2rem;
  margin: 0px 0px 30px 0px;
  text-transform: capitalize;
  text-decoration: underline;
}
#login-form {
  width: 80%;
  margin: 20px auto 80px;

  @media screen and (min-width: 992px) {
    width: 40%;
    margin: 20px auto 80px;
  }

  a.register {
    text-decoration: underline;

    &:hover {
      color: rgb(34, 112, 214);
    }
  }

  .is-left {
    float: left;
  }

  .is-right {
    float: right;
  }
}
</style>