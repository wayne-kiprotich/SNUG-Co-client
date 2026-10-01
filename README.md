# Snug & Co. website

The storefront for SNUG & Co. (@snug_co_ke), a Nairobi clothing brand. Customers browse the collection, pick a piece and its options, then order through a prefilled WhatsApp message. It is built to the PRD in `../prd.md`.

Stack: React 19, Vite, JavaScript, Tailwind CSS 4, React Router. It works on its own with the bundled catalog, and it can read the catalog from the Flask API in `../server`, which adds the admin at `/admin` (see `../server/README.md`).

## Run it

```bash
npm install
cp .env.example .env    # then set VITE_WHATSAPP_NUMBER and VITE_SITE_URL
npm run dev             # http://localhost:5173
npm run build           # production build in dist/
npm run preview         # serve dist/ locally
```

## Where things live

| Path | What it holds |
| --- | --- |
| `src/config/site.js` | Brand, WhatsApp, Instagram, address, opening hours, announcement, policies. Every component reads these from here. |
| `src/data/products.js` | The bundled product catalog. Used when `VITE_API_URL` is empty. With the API, the admin manages the catalog instead. |
| `src/admin/` | The admin screens (sign in, products, photos, categories, collections, account). Loaded only at `/admin`. |
| `src/data/categories.js` | Categories (Lounge sets, Tracksuits, Jackets, Sweatshirts & tops) and collections (Kenya, Matchday, His & Hers). |
| `src/data/social.js` | Instagram gallery tiles and testimonials. |
| `src/lib/catalog.js` | Loads the catalog from the API when `VITE_API_URL` is set, otherwise from the bundled data. |
| `src/lib/images.js` | Finds a photo by id, whether it is bundled or uploaded through the admin. |
| `src/lib/whatsapp.js` | Builds the order message and wa.me links. |
| `src/lib/analytics.js` | Provider-agnostic events (`whatsapp_order_clicked`, `product_viewed`, …) pushed to `window.dataLayer`. |
| `src/lib/seo.js` | Per-page title, description, canonical, Open Graph and JSON-LD. |

## Content sources

All product names, prices, materials, sizes and photos come from SNUG's own Instagram posts. The brand colours are sampled from the logo. The About page uses SNUG's own published words.

## Before launch: confirm with SNUG

These are placeholders in the code and must not go live unconfirmed (PRD §55–56):

- **WhatsApp number.** Not published anywhere. Until it is set, order buttons open WhatsApp and the customer has to choose the chat.
- **Prices.** Only three prices are published (Tropical Vibes Short Set, Striped Short Set and Club Puff Jacket, each KSh 4,500). Every other piece shows "Price on request".
- **Sizes.** Only the Argentina Jersey has a published size range (S–XXL). The other pieces ask the customer to share their size on WhatsApp.
- **Availability.** Everything defaults to `available`.
- **Product names** where `nameConfirmed: false`: Colour-Block Short Set, Beige Lounge Set, Green Tracksuit, Club Puff Jacket, Argentina Jersey and Manchester United Retro Jacket.
- **Colour names** for the Green Tracksuit (Bottle green and Teal green).
- **Address.** Taken from the Instagram bio.
- **Opening hours, phone, email.** Not published, so they are hidden.
- **Delivery, collection, payment and returns policies.** Not published. The Orders page asks customers to confirm on WhatsApp.
- **Testimonials.** Kept empty until SNUG supplies approved quotes. The section links to the Instagram Feedback highlight instead.
- **Matchday pieces.** These carry football club, federation and sportswear marks. Confirm that SNUG wants them listed on a public website.
- **About copy, logo files and official colours.**

## Adding or editing a product

Use `/admin`. `src/data/products.js` is the fallback catalog used only when `VITE_API_URL` is empty.

## Deploying

Flask serves the built site and falls back to `index.html` for page routes (see `render.yaml` and `server/README.md`). Set `VITE_SITE_URL` so that canonical and share links use the real domain.

Share previews on WhatsApp and Facebook read the static tags in `index.html`, because those crawlers don't run JavaScript. If you need a separate preview for each product, prerender those pages at build time. That is a later enhancement.
# snugco-client
