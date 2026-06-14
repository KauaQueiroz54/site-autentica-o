import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        cadastro: 'cadastro.html',
        dashboard: 'dashboard.html',
        recuperar: 'recuperar.html',
        bemvindo: 'bemvindo.html',
      }
    }
  }
})