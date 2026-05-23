import { reactRouter } from '@react-router/dev/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [reactRouter(), checker({ typescript: true })],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
  server: {
    port: Number(process.env.REACT_APP_PORT) || 5173,
  },
  envDir: '.env',
  envPrefix: 'REACT_APP_',
});
