import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        profile: 'pages/profile.html',
        product: 'pages/product.html',
        login: 'pages/login.html',
        register: 'pages/register.html',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
    },
  },
});
