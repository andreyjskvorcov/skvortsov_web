import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import NotesPage from './pages/NotesPage.vue';
import AboutPage from './pages/AboutPage.vue';
import { syncThemeWithParent } from './theme';
import './style.css';

// Hash-история: приложение статическое и открывается в iframe, серверу не нужно знать про его маршруты
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: NotesPage },
    { path: '/about', component: AboutPage },
  ],
});

syncThemeWithParent();
createApp(App).use(router).mount('#app');
