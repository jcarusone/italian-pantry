# Italian Pantry

The Italian Pantry storefront and its content admin.

- **Shopify** holds products, prices, cart and checkout.
- **Neon Postgres** holds everything else: page text and images, header and footer menus,
  Stories, and the image library.
- **Neon Auth** handles admin sign-in; only users with role `admin` in `neon_auth.user` may use `/admin`.
- **Vercel Blob** stores uploaded images.

Built with Next.js 16, Tailwind CSS 4, Drizzle ORM, Motion, dnd-kit and TipTap.

## First-time setup

1. **Install:** `npm install`
2. **Environment:** copy `.env.example` to `.env.local` and fill it in (details below).
3. **Database:** create the tables and load the current site content:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
   The seed only adds what's missing. It never overwrites edits, so it's safe to run again.
4. **Run:** `npm run dev`, then open `http://localhost:3000/admin`.

### Deploying on Vercel

1. Import the repository into Vercel.
2. **Neon:** add the Neon integration (or paste `DATABASE_URL` yourself; use the *pooled*
   connection string). In the Neon console, open your project → **Auth**, enable it, and copy
   the Auth URL into `NEON_AUTH_BASE_URL`. Set `NEON_AUTH_COOKIE_SECRET` to a random 32+ character
   string.
3. **Images:** Vercel → **Storage** → create a **Blob** store and connect it to the project. This
   adds `BLOB_READ_WRITE_TOKEN` automatically.
4. Add the Shopify variables.
5. Run `npm run db:migrate && npm run db:seed` once against the production database (locally
   with the production `DATABASE_URL`, or as a Vercel build step).

### Signing in for the first time

1. In the Neon console (Auth → Users), set your user's **role** to `admin` (or run
   `UPDATE neon_auth."user" SET role = 'admin' WHERE email = 'you@example.com';`).
2. Go to `/admin/sign-up`, create your password, then sign in at `/admin/sign-in`.

Only `admin` roles get into the panel. Other Neon Auth users see a "no access" message.

## What you can edit in the admin (`/admin`)

| Area | What it controls |
| --- | --- |
| **Homepage layout** | Drag homepage sections into a new order; show or hide each one (including "Latest stories"). |
| **Page content** | Every text and image on the site, section by section: hero, ribbon, story, olive oil feature, region, mission, gallery, reasons, label guide, About, Contact and FAQ, shop and product page text, Stories page, and site settings (announcement bar, contact details, footer text, search-engine text). Lists (facts, values, FAQs, photos…) can be added to, removed and reordered by dragging. |
| **Menus** | Header links and footer columns. Drag links to reorder them or into another menu; drag footer columns to reorder; rename, add and remove columns. The Shop column can list Shopify collections automatically. |
| **Stories** | Write stories in a rich text editor (headings, bold, italic, links, lists, quotes, images), with cover image, summary, author, web address, search-engine text, and draft, publish or scheduled publishing. Drag to set their order on the Stories page. |
| **Images** | Upload (drag files in), describe, copy the address of, or delete images. Large photos are resized in the browser before upload. |

Every save updates the live site immediately. "Reset to original" puts a section back to the
original copy.

Text formatting in long-text fields: `**bold**`, `*italic*`, and a blank line between
paragraphs. In "Heading" fields, each line of text becomes one line of the heading.

## How it's organised

```
app/(site)/          public pages (home, about, contact, products, stories, cart)
app/admin/           the admin (sign-in, and the panel behind it)
components/admin/    admin UI: forms, drag-and-drop, editor, image picker
lib/cms/sections.ts  every editable section: its admin fields and original copy
lib/cms/content.ts   cached reads used by the public pages
lib/admin/actions.ts admin saves (each checks access and refreshes the site)
lib/auth/            Neon Auth and the neon_auth.user role check
lib/db/schema.ts     database tables (Drizzle); migrations live in /drizzle
```

**Adding a new editable field:** add it to the section's `fields` and `DEFAULTS` in
`lib/cms/sections.ts`, then use it in the component. The admin form updates itself, and saved
sections pick up the default value until someone edits it.

**Changing the database schema:** edit `lib/db/schema.ts`, run `npm run db:generate`, then
`npm run db:migrate`.

## Resilience

If the database is unreachable, the public site keeps working and shows the original copy and
menus. If Shopify is unreachable, product sections show their fallback text.

## Local development without Neon Auth

Leave the `NEON_AUTH_*` variables empty and set `ADMIN_DEV_PASSWORD`. You can then sign in at
`/admin/sign-in` with an email whose `neon_auth.user.role` is `admin` and that password. This only works when Neon
Auth isn't configured; never set it in production. Without `BLOB_READ_WRITE_TOKEN`, uploads are
saved to a local `.uploads` folder.

`SHOPIFY_DEMO_MODE=true` shows sample products before the store is connected. The cart is
disabled in this mode.

## Before launch

- Confirm the flagship name spelling (Page content → Olive oil feature). The brief says
  "Aritza"; the bottle label says "Arrizza".
- Confirm the contact details (Page content → Site settings).
- The contact form only logs messages on the server. Connect it to an inbox or helpdesk in
  `lib/contact-actions.ts`.
