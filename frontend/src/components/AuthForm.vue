<template>
  <div class="auth-form">
    <h2>{{ isLogin ? 'Вход' : 'Регистрация' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div v-if="!isLogin" class="form-group">
        <label>Имя</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Введите имя"
        />
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="Введите email"
        />
      </div>
      
      <div class="form-group">
        <label>Пароль</label>
        <input
          v-model="form.password"
          type="password"
          required
          minlength="6"
          placeholder="Введите пароль"
        />
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться') }}
      </button>
    </form>
    
    <div class="switch-mode">
      <span>{{ isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}</span>
      <button @click="toggleMode" class="link-btn">
        {{ isLogin ? 'Зарегистрироваться' : 'Войти' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  form.name = '';
  form.email = '';
  form.password = '';
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    if (isLogin.value) {
      await authStore.login(form.email, form.password);
    } else {
      await authStore.register(form.email, form.password, form.name);
    }
    router.push('/game');
  } catch (err) {
    error.value = err.response?.data?.error || 'Произошла ошибка';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: #0f0f1e;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

h2 {
  color: #fff;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    color: #888;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  input {
    width: 100%;
    padding: 12px;
    background: #16213e;
    border: 2px solid #333;
    border-radius: 6px;
    color: #fff;
    font-size: 16px;
    transition: border-color 0.3s;
    
    &:focus {
      outline: none;
      border-color: #0ea5e9;
    }
  }
}

.error-message {
  color: #f87171;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 6px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #0ea5e9;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover:not(:disabled) {
    background: #0284c7;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.switch-mode {
  margin-top: 20px;
  text-align: center;
  color: #888;
  
  .link-btn {
    background: none;
    border: none;
    color: #0ea5e9;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 5px;
    
    &:hover {
      color: #0284c7;
    }
  }
}

@media (max-width: 480px) {
  .auth-form {
    padding: 20px;
  }
}
</style>

