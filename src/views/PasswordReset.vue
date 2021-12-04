<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div class="reset-password">
<div class="box">
<form action="" @submit.prevent="submit">
    <div class="field">
    <div class="control">
        <label for="newpwd" class="label has-text-left">New Password</label>
        <input type="password" placeholder="new password" id="newpwd" v-model="fields.newPassword" class="input">
        <p class="has-text-danger has-text-left" v-show="fieldsEmpty.newPassword">field empty!</p>
    </div>
    </div>
    <div class="field">
    <div class="control">
        <label for="confirmpwd" class="label has-text-left">Confirm Password</label>
        <input type="password" placeholder="confirm password" id="confirmpwd" v-model="fields.confirmPassword" class="input" @input="confirmPassword(fields.confirmPassword,fields.newPassword)">
    </div>
    <p v-show="fieldsEmpty.confirmPassword" class="has-text-danger">confirm password empty!</p>
    <p v-show="!passwordMatch" class="has-text-danger">password did not match!</p>
    </div>
    <div><input type="hidden" ref="hidden" :value="voterEmail"></div>
    <button :class="[{'is-loading': loading, 'is-medium': loading}, 'button is-primary is-fullwidth']" type="submit">Reset Password</button>
</form>
</div>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'ChangePassword',
    data() {
        return {
            fields: {
                newPassword: '',
                confirmPassword: '',
            },
            fieldsEmpty: {
                newPassword: false,
                confirmPassword: false,
            },
            passwordMatch: true,
        }
    },
    computed: {
      ...mapGetters(['loading', 'voterEmail']),
      notificationSuccess() {
        return this.$store.getters.notification?.success
      },
      notificationMessage() {
        return this.$store.getters.notification?.message
      }
    },
    beforeRouteLeave() {
      if (!this.notificationSuccess) {
        this.$store.dispatch("unsetNotification");
      }
    },
    methods: {
      submit() {
        if (!this.validateInput(this.fields)) return;
        if (!this.confirmPassword(this.fields.confirmPassword, this.fields.newPassword)) return;

        let vm = this;

        this.$store.dispatch('resetPassword', {password: vm.fields.newPassword, email: this.$refs.hidden.value})
        .then(() => {
            vm.fields.newPassword = '';
            vm.fields.confirmPassword = '';

          this.$router.push({name: 'login'});
        })
        .catch(() => {
          this.fields.newPassword = vm.fields.newPassword;
          this.fields.confirmPassword = vm.fields.confirmPassword;

          this.$router.push({name: 'resetPassword'});
        })
      },
      validateInput() {
        let validate = true;

        for (const field in this.fields) {
          if (Object.hasOwnProperty.call(this.fields, field) && !this.fields[field]) {
            this.fieldsEmpty[field] = true;
            validate = false;
          }
        }

        return validate;
      },
      confirmPassword(confirmPassword, newPassword) {
        if (confirmPassword !== newPassword) {
          this.passwordMatch = false;
          return false;
        }

        this.passwordMatch = true;
        return true;
      }
    }
}
</script>
<style scoped>
.reset-password {
  padding: 40px 0px;
}
.box {
    width: 50%;
    margin: 0 auto;
}
</style>