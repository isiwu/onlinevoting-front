<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div id="change-password-form">
  <div class="box">
    <h2 class="title">Change Password</h2>
    <form action="" @submit.prevent="submit">
      <div class="field">
        <label for="oldpwd" class="label has-text-left">Old Password</label>
        <div class="control">
          <input type="password" placeholder="old password" id="oldpwd" v-model="fields.oldPassword" class="input" @input="clearErrorMessage">
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.oldPassword">field empty!</p>
        </div>
      </div>
      <div class="field">
        <label for="newpwd" class="label has-text-left">New Password</label>
        <div class="control">
          <input type="password" placeholder="new password" id="newpwd" v-model="fields.newPassword" class="input" @input="clearErrorMessage">
          <p class="has-text-danger has-text-left" v-show="fieldsEmpty.oldPassword">field empty!</p>
        </div>
      </div>
      <div class="field">
        <label for="confirmpwd" class="label has-text-left">Confirm Password</label>
        <div class="control">
          <input type="password" placeholder="confirm password" id="confirmpwd" v-model="fields.confirmPassword" class="input" @input="confirmPassword(fields.newPassword,fields.confirmPassword)" @change="clearErrorMessage">
        </div>
        <p v-show="fieldsEmpty.confirmPassword" class="has-text-danger">confirm password empty!</p>
        <p v-show="!passwordMatch" class="has-text-danger">password did not match!</p>
      </div>
      <button :class="[{'is-loading': loading, 'is-medium': loading}, 'button is-primary float-right']" type="submit">Change Password</button>
      <router-link class="button is-danger float-left has-background-danger has-text-white" to="/home">Cancel</router-link>
    </form>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'ChangePassword',
    data() {
        return {
            fields: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            fieldsEmpty: {
                oldPassword: false,
                newPassword: false,
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
    beforeRouteLeave() {
      if (!this.notificationSuccess) {
        this.$store.dispatch("unsetNotification");
      }
    },
    methods: {
      submit() {
        if (!this.validateInput(this.fields)) return;
        if (!this.confirmPassword(this.fields.confirmPassword, this.fields.newPassword)) {
          return;
        }

        let vm = this;

        this.$store.dispatch('changePassword', {oldPassword: vm.fields.oldPassword, newPassword: vm.fields.newPassword})
        .then(() => {
          vm.fields.oldPassword = '';
          vm.fields.newPassword = '';
          vm.fields.confirmPassword = '';

          this.$router.push({name: 'home'});
        })
        .catch(() => {
          this.fields.oldPassword = vm.fields.oldPassword;
          this.fields.newPassword = vm.fields.newPassword;
          this.fields.confirmPassword = vm.fields.confirmPassword;

          this.$router.push({name: 'changePassword'});
        })
      },
      validateInput() {
        let valid = true;

        for (const field in this.fields) {
          if (Object.hasOwnProperty.call(this.fields, field) && !this.fields[field]) {
            this.fieldsEmpty[field] = true;
            valid = false;
          }
        }

        return valid;
      },
      confirmPassword(confirmPassword, newPassword) {
        if (confirmPassword !== newPassword) {
          this.passwordMatch = false;
          return false;
        }

        this.passwordMatch = true;
        return true;
      },
      clearErrorMessage() {
        for (const field in this.fieldsEmpty) {
          if (Object.hasOwnProperty.call(this.fieldsEmpty, field) && this.fieldsEmpty[field]) {
            this.fieldsEmpty[field] = false;
          }
        }
      }
    }
}
</script>
<style lang="scss" scoped>
#change-password-form {
  margin-top: 40px;
}
.box {
  width: 50%;
  margin: 0 auto;
  padding-bottom: 60px;

  .button {
    display: block;
    margin-bottom: 8px;
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    .button {
      display: inline;
      width: 25%;
      padding: 8px;
    }
    .float-right {
      float: right;
    }

    .float-left {
      float: left;
      width: 15%;
    }

    a {
      padding: 8px;
    }
  }
}
</style>