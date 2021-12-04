<template>
<div v-if="notificationSuccess" class="has-background-success has-text-white">{{ notificationMessage }}</div>
<div v-else-if="!notificationSuccess" class="has-background-danger has-text-white">{{ notificationMessage }}</div>
<div class="has-background-white">
  <p class="pt-5 is-size-3"><router-link to="/">home</router-link></p>
</div>
</template>

<script>
export default {
  name: 'LoginDetailsOk',
  computed: {
    notificationSuccess() {
      return this.$store.getters.notification?.success
    },
    notificationMessage() {
      return this.$store.getters.notification?.message
    },
  },
  beforeRouteLeave() {
    this.$store.dispatch("unsetNotification");
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 70%;
  margin: 0 auto;

  p {
    color: #000;
    font-size: 1.2rem;
    font-family: Arial, Helvetica, sans-serif;
    padding-left: 4px;
    padding-right: 4px;
    // font-weight: bold;
  }
}
</style>