2026-04-17T11:13:36.035936Z	Cloning repository...
2026-04-17T11:13:36.906742Z	 * branch            bc248e8a1f805186cf5db6ab1576fc14a69a7ee0 -> FETCH_HEAD
2026-04-17T11:13:36.90682Z	
2026-04-17T11:13:36.941953Z	HEAD is now at bc248e8 Update [productSlug].astro
2026-04-17T11:13:36.942349Z	
2026-04-17T11:13:36.985825Z	
2026-04-17T11:13:36.986295Z	Using v2 root directory strategy
2026-04-17T11:13:36.998978Z	Success: Finished cloning repository files
2026-04-17T11:13:39.150807Z	Checking for configuration in a Wrangler configuration file (BETA)
2026-04-17T11:13:39.151314Z	
2026-04-17T11:13:39.151394Z	Found wrangler.json file. Reading build configuration...
2026-04-17T11:13:39.156427Z	pages_build_output_dir: dist
2026-04-17T11:13:39.156549Z	Build environment variables: (none found)
2026-04-17T11:13:40.253269Z	Successfully read the Wrangler configuration file.
2026-04-17T11:13:40.496716Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-17T11:13:40.498037Z	Installing project dependencies: npm clean-install --progress=false
2026-04-17T11:13:43.279108Z	npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
2026-04-17T11:13:49.963078Z	npm warn deprecated lucide-astro@0.556.0: Deprecated: Use `@lucide/astro`
2026-04-17T11:13:50.484322Z	
2026-04-17T11:13:50.484563Z	added 711 packages, and audited 712 packages in 10s
2026-04-17T11:13:50.484625Z	
2026-04-17T11:13:50.484664Z	350 packages are looking for funding
2026-04-17T11:13:50.484695Z	  run `npm fund` for details
2026-04-17T11:13:50.504469Z	
2026-04-17T11:13:50.504759Z	4 vulnerabilities (2 moderate, 2 high)
2026-04-17T11:13:50.504866Z	
2026-04-17T11:13:50.504921Z	To address all issues, run:
2026-04-17T11:13:50.504992Z	  npm audit fix
2026-04-17T11:13:50.505026Z	
2026-04-17T11:13:50.505057Z	Run `npm audit` for details.
2026-04-17T11:13:50.574018Z	Executing user command: echo "PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL" && npm run build
2026-04-17T11:13:50.576362Z	PUBLIC_API_BASE_URL=
2026-04-17T11:13:51.046514Z	
2026-04-17T11:13:51.047129Z	> amrita-geoseo-fabric-frontend@0.0.1 build
2026-04-17T11:13:51.047194Z	> astro build
2026-04-17T11:13:51.04726Z	
2026-04-17T11:13:53.013639Z	[redirects] Failed to fetch redirects: TypeError: Failed to parse URL from undefined/api/redirect
2026-04-17T11:13:53.014193Z	    at node:internal/deps/undici/undici:13510:13
2026-04-17T11:13:53.014327Z	    at async fetchRedirects (/opt/buildhome/repo/src/lib/redirects.ts:14:17)
2026-04-17T11:13:53.014416Z	    at async buildAstroRedirects (/opt/buildhome/repo/src/lib/redirects.ts:34:17)
2026-04-17T11:13:53.014464Z	    at async eval (/opt/buildhome/repo/astro.config.ts:8:19)
2026-04-17T11:13:53.014536Z	    at async ESModulesEvaluator.runInlinedModule (file:///opt/buildhome/repo/node_modules/astro/node_modules/vite/dist/node/module-runner.js:913:3)
2026-04-17T11:13:53.014599Z	    at async ModuleRunner.directRequest (file:///opt/buildhome/repo/node_modules/astro/node_modules/vite/dist/node/module-runner.js:1146:59)
2026-04-17T11:13:53.014672Z	    at async ModuleRunner.cachedRequest (file:///opt/buildhome/repo/node_modules/astro/node_modules/vite/dist/node/module-runner.js:1053:73)
2026-04-17T11:13:53.014735Z	    at async ModuleRunner.import (file:///opt/buildhome/repo/node_modules/astro/node_modules/vite/dist/node/module-runner.js:1014:10)
2026-04-17T11:13:53.014807Z	    at async loadConfigWithVite (file:///opt/buildhome/repo/node_modules/astro/dist/core/config/vite-load.js:42:19)
2026-04-17T11:13:53.01487Z	    at async loadConfig (file:///opt/buildhome/repo/node_modules/astro/dist/core/config/config.js:57:12) {
2026-04-17T11:13:53.014914Z	  [cause]: TypeError: Invalid URL
2026-04-17T11:13:53.014963Z	      at new URL (node:internal/url:818:25)
2026-04-17T11:13:53.015024Z	      at new Request (node:internal/deps/undici/undici:9586:25)
2026-04-17T11:13:53.0151Z	      at fetch (node:internal/deps/undici/undici:10315:25)
2026-04-17T11:13:53.015148Z	      at fetch (node:internal/deps/undici/undici:13508:10)
2026-04-17T11:13:53.015197Z	      at fetch (node:internal/bootstrap/web/exposed-window-or-worker:75:12)
2026-04-17T11:13:53.01524Z	      at fetchRedirects (/opt/buildhome/repo/src/lib/redirects.ts:14:23)
2026-04-17T11:13:53.015286Z	      at buildAstroRedirects (/opt/buildhome/repo/src/lib/redirects.ts:34:23)
2026-04-17T11:13:53.015332Z	      at eval (/opt/buildhome/repo/astro.config.ts:8:25)
2026-04-17T11:13:53.015379Z	      at async ESModulesEvaluator.runInlinedModule (file:///opt/buildhome/repo/node_modules/astro/node_modules/vite/dist/node/module-runner.js:913:3)
2026-04-17T11:13:53.015427Z	      at async ModuleRunner.directRequest (file:///opt/buildhome/repo/node_modules/astro/node_modules/vite/dist/node/module-runner.js:1146:59) {
2026-04-17T11:13:53.015479Z	    code: 'ERR_INVALID_URL',
2026-04-17T11:13:53.015524Z	    input: 'undefined/api/redirect'
2026-04-17T11:13:53.015568Z	  }
2026-04-17T11:13:53.015617Z	}
2026-04-17T11:13:53.477246Z	[2m11:13:53[22m [34m[content][39m Syncing content
2026-04-17T11:13:53.482113Z	[2m11:13:53[22m [34m[content][39m Synced content
2026-04-17T11:13:53.483435Z	[2m11:13:53[22m [34m[types][39m Generated [2m389ms[22m
2026-04-17T11:13:53.483783Z	[2m11:13:53[22m [34m[build][39m output: [34m"static"[39m
2026-04-17T11:13:53.483991Z	[2m11:13:53[22m [34m[build][39m mode: [34m"static"[39m
2026-04-17T11:13:53.484123Z	[2m11:13:53[22m [34m[build][39m directory: [34m/opt/buildhome/repo/dist/[39m
2026-04-17T11:13:53.48421Z	[2m11:13:53[22m [34m[build][39m Collecting build info...
2026-04-17T11:13:53.484468Z	[2m11:13:53[22m [34m[build][39m [32m✓ Completed in 414ms.[39m
2026-04-17T11:13:53.486229Z	[2m11:13:53[22m [34m[build][39m Building static entrypoints...
2026-04-17T11:13:55.719704Z	[33m[1m11:13:55[22m [WARN] [vite][39m [33m"matchHostname", "matchPathname", "matchPort" and "matchProtocol" are imported from external module "@astrojs/internal-helpers/remote" but never used in "node_modules/astro/dist/assets/utils/index.js".[39m
2026-04-17T11:13:55.944294Z	[2m11:13:55[22m [34m[vite][39m [32m✓ built in 2.40s[39m
2026-04-17T11:13:56.055247Z	[2m11:13:56[22m [34m[vite][39m [32m✓ built in 109ms[39m
2026-04-17T11:13:56.09041Z	[2m11:13:56[22m [34m[build][39m Rearranging server assets...
2026-04-17T11:13:56.132711Z	
2026-04-17T11:13:56.133178Z	[42m[30m generating static routes [39m[49m
2026-04-17T11:13:56.348339Z	Failed to parse URL from undefined/api/product?page=1&limit=500
2026-04-17T11:13:56.348598Z	  [1mLocation:[22m
2026-04-17T11:13:56.348654Z	    [4m/opt/buildhome/repo/node_modules/astro/dist/core/render/route-cache.js:29:17[24m
2026-04-17T11:13:56.348694Z	  [1mStack trace:[22m
2026-04-17T11:13:56.348742Z	[2m    at node:internal/deps/undici/undici:13510:13
2026-04-17T11:13:56.348789Z	    at async getAllProducts (file:///opt/buildhome/repo/dist/.prerender/chunks/api_SyIkkfHp.mjs:15:17)
2026-04-17T11:13:56.348823Z	    at async fetchProducts (file:///opt/buildhome/repo/dist/.prerender/chunks/products_ClXGWj83.mjs:146:26)
2026-04-17T11:13:56.348858Z	    at async Module.getStaticPaths (file:///opt/buildhome/repo/dist/.prerender/chunks/_productSlug__XuZDGLUY.mjs:11:34)
2026-04-17T11:13:56.348891Z	    at async #getPathsForRoute (file:///opt/buildhome/repo/node_modules/astro/dist/runtime/prerender/static-paths.js:54:25)[22m
2026-04-17T11:13:56.349046Z	  [1mCaused by:[22m
2026-04-17T11:13:56.349119Z	[2m  Invalid URL
2026-04-17T11:13:56.349205Z	    at new URL (node:internal/url:818:25)
2026-04-17T11:13:56.349275Z	    at fetch (node:internal/deps/undici/undici:10315:25)
2026-04-17T11:13:56.349345Z	    at fetch (node:internal/bootstrap/web/exposed-window-or-worker:75:12)
2026-04-17T11:13:56.349393Z	    at getAllProducts (file:///opt/buildhome/repo/dist/.prerender/chunks/api_SyIkkfHp.mjs:15:23)
2026-04-17T11:13:56.349569Z	    at Module.getStaticPaths (file:///opt/buildhome/repo/dist/.prerender/chunks/_productSlug__XuZDGLUY.mjs:12:5)[22m
2026-04-17T11:13:56.448862Z	Failed: Error while executing user command. Exited with error code: 1
2026-04-17T11:13:56.454923Z	Failed: build command exited with code: 1
2026-04-17T11:13:57.158404Z	Failed: error occurred while running build command