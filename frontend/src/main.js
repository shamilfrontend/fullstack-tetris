import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './store/authStore';
import './assets/scss/main.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Инициализация authStore
const authStore = useAuthStore();
authStore.init();

app.mount('#app');

