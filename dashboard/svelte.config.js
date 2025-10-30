import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    experimental: {
      async: true
    }
  },
  kit: {
    alias: {
      $api: "../api/src"
    },
    experimental: {
      remoteFunctions: true
    },
    adapter: adapter()
  }
}

export default config
