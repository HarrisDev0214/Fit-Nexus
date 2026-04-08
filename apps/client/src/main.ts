import { createApp } from 'vue';
import '@/assets/css/main.css';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';
import App from '@/App.vue';
import { router } from '@/router/index';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(ui);

app.mount('#app');
