import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import Primevue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/Tooltip';
import Aura from '@primeuix/themes/aura';

const app = createApp(App);

const preset = definePreset(Aura, {
  components: {}
});

app.use(Primevue, {
  theme: {
    preset
  }
});
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.mount('#app');
