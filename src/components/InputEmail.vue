<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<h2 class="login-details title mt-4">{{title}}</h2>
<div id="container">
<div id="login-form" class="box">
  <form action="" @submit.prevent="submit" @input.capture="clearErrorMessage">
    <div class="field is-grouped is-grouped-center">
      <div class="control is-expanded">
        <input type="text" v-model="email" placeholder="email" class="input">
      </div>
      <span v-if="emailEmpty" class="has-text-danger">email must not be empty!</span>
      <div class="control">
        <button :class="[{'is-loading': loading, 'is-medium': loading}, 'button is-primary']">{{ button }}</button>
      </div>
    </div>
  </form>
</div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'InputEmail',
  props: ['title','getterName','methodName', 'submitButtonText'],
  data() {
    return {
      email:'',
      emailEmpty: false,
      button: this.submitButtonText,
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
    submit() {
      if (!this.validateInput(this.email)) return;

      this.$store.dispatch(this.methodName, {email: this.email})
      .then(() => {
        this.email = '';
        this.button = 'Resend Link';
        this.$router.push({name: this.methodName});
      })
      .catch(() => {
        const vm = this;
        this.email = vm.email;
        this.$router.push({name: this.methodName});
      })
    },
    validateInput(input) {
      let valid = true;

      if (!input) {
        this.emailEmpty = true;
        valid = false;
      }

      return valid
    },
    clearErrorMessage() {
      if (this.email) this.emailEmpty = false;
    }
  }
}
</script>
<style lang="scss" scoped>
#container {
  @media screen and (min-width: 577px) {
    margin-bottom: 156px;
  }

  .box {
  width: 70%;
  margin: 0 auto;

  @media screen and (min-width:768px) {
    width: 50%;
  }
}
}

</style>