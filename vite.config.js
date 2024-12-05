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
