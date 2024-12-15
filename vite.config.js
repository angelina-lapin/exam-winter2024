import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  appType: 'mpa',
  base: '',
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        home: path.resolve(__dirname, 'src/pages/home.html'),
        profile: path.resolve(__dirname, 'src/pages/profile.html'),
        product: path.resolve(__dirname, 'src/pages/product.html'),
        login: path.resolve(__dirname, 'src/pages/login.html'),
        register: path.resolve(__dirname, 'src/pages/registration.html'),
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '_redirects',
          dest: '',
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
    },
  },
});
