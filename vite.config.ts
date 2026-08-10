// `defineConfig` vem de 'vitest/config', e não de 'vite': é a versão que
// conhece a chave `test`. Importar de 'vite' faz o `tsc -b` do build reprovar.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // O campo "browser" do pacote aponta para um build UMD cujo default,
      // depois de passar pelo pré-bundle do esbuild, vira o módulo inteiro
      // em vez da função Lottie. Resolver direto para o build ESM evita isso.
      'lottie-react': fileURLToPath(
        new URL('./node_modules/lottie-react/build/index.es.js', import.meta.url),
      ),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) {
            return 'vendor'
          }
        },
      },
    },
  },
  // Só funções puras têm teste aqui — validação, máscaras e formatadores.
  // Nada de DOM, por isso `node` em vez de jsdom.
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
