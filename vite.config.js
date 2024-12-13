import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        profile: 'src/pages/profile.html',
        product: 'src/pages/product.html',
        login: 'src/pages/login.html',
        register: 'src/pages/registration.html',
      },
    },
  },
  rollupOptions: {
    external: [
      '/src/scripts/product.js',
      '/src/scripts/profile.js',
      '/src/scripts/forms.js',
    ],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
    },
  },
});
