import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev: proxy the Flask API so it's one domain, like production.
const api = process.env.API_ORIGIN || 'http://127.0.0.1:5000'

const SITE_ORIGIN = /^https?:\/\/[^\s"'<>/]+$/

// Settings the live site can't do without. A Vercel production build stops on any of these;
// every other build (previews, local) only warns.
function launchProblems(env, siteUrl) {
  const problems = []
  if (!env.VITE_API_URL) {
    problems.push('VITE_API_URL is empty, so the shop would show the bundled sample catalog. Set it to /api.')
  }
  const number = (env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  if (!number) {
    problems.push('VITE_WHATSAPP_NUMBER is empty, so order buttons would open WhatsApp with no recipient.')
  } else if (number.startsWith('0') || number.length < 10 || number.length > 15) {
    problems.push('VITE_WHATSAPP_NUMBER must be in international format without the leading 0 (e.g. 2547XXXXXXXX).')
  }
  if (!SITE_ORIGIN.test(siteUrl) || !siteUrl.startsWith('https://')) {
    problems.push('VITE_SITE_URL must be the live https:// address with no path or trailing slash (e.g. https://www.example.co.ke).')
  }
  return problems
}

// Files that need the live address: robots.txt (its Sitemap line must be absolute) and the
// share-preview image in index.html (WhatsApp and Facebook don't run JavaScript or resolve
// relative image paths).
function siteFiles(siteUrl) {
  const known = SITE_ORIGIN.test(siteUrl)
  return {
    name: 'snug-site-files',
    transformIndexHtml(html) {
      if (known) {
        html = html.replace('property="og:image" content="/og-default.jpg"', `property="og:image" content="${siteUrl}/og-default.jpg"`)
      }
      // An empty verification tag does nothing; leave it out until Search Console gives a value.
      return html.replace(/\n\s*<meta name="google-site-verification" content="\s*" \/>/, '')
    },
    generateBundle() {
      const lines = ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api', 'Disallow: /cart', 'Disallow: /wishlist']
      if (known) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${lines.join('\n')}\n` })
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '')

  if (command === 'build') {
    const problems = launchProblems(env, siteUrl)
    if (problems.length && process.env.VERCEL_ENV === 'production') {
      throw new Error(`Production build stopped:\n- ${problems.join('\n- ')}`)
    }
    for (const problem of problems) console.warn(`[snug] ${problem}`)
  }

  return {
    plugins: [react(), tailwindcss(), siteFiles(siteUrl)],
    server: {
      // Keep changeOrigin false: the API checks Origin against Host.
      proxy: {
        '/api': { target: api, changeOrigin: false },
        '/uploads': { target: api, changeOrigin: false },
      },
    },
  }
})
