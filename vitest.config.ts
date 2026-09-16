import path from 'node:path'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, type Plugin } from 'vitest/config'

/* next/image is handed a StaticImageData object by the Next build's image loader.
   Vite resolves an image import to a URL string instead, which makes every plate
   render blow up on src.src. This reproduces the loader's output shape so the real
   next/image component is exercised rather than mocked away. */
function nextStaticImage(): Plugin {
  return {
    name: 'next-static-image',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0]
      if (!/\.(jpe?g|png|gif|webp|avif)$/i.test(file)) return null
      const name = path.basename(file)
      return `export default {
        src: '/_next/static/media/${name}',
        width: 1200,
        height: 900,
        blurDataURL: 'data:image/jpeg;base64,/9j/',
        blurWidth: 8,
        blurHeight: 6
      }`
    },
  }
}

export default defineConfig({
  plugins: [tsconfigPaths(), react(), nextStaticImage()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
