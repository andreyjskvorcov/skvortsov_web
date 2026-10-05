import { createApp } from 'vue';
import App from './App.vue';
import { syncTheme } from './theme';
import './style.css';

syncTheme();
createApp(App).mount('#app');
