<template>
  <input-email title='Recover Password' method-name='forgetPassword' submit-button-text='Recover Password' />
</template>
<script>
import InputEmail from '../components/InputEmail.vue'
export default {
  name: 'ForgetPassword',
  components: { InputEmail },
}
</script>