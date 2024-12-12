import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        profile: 'src/pages/profile.html',
        product: 'src/pages/product.html',
        login: 'src/pages/login.html',
        register: 'src/pages/register.html',
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
