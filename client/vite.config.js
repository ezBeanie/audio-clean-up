import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config({ path: '../.env.local', override: true });

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: process.env.CLIENT_PORT_DEV || 8081,
    proxy: {
      '/api': `http://localhost:${process.env.SERVER_PORT || 8080}`
    }
  }
});
