import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/Tooltip';
import Aura from '@primeuix/themes/aura';
import './style.scss';
import { createI18n } from 'vue-i18n';
import de from './translations/de.js';
import en from './translations/en.js';

const app = createApp(App);
const vueI18n = createI18n({
  locale: 'en',
  fallbackLng: 'de',
  messages: {
    de,
    en
  }
});

app.use(vueI18n);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(ToastService);

app.directive('tooltip', Tooltip);

app.mount('#app');
