<template>
  <div class="auth-view">
    <AuthForm />
  </div>
</template>

<script setup>
import AuthForm from '../components/AuthForm.vue';
</script>

<style lang="scss" scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0f0f1e 0%, #16213e 100%);
}
</style>

