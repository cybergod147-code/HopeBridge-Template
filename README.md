# HopeBridge International

A production-oriented Next.js 14 App Router charity experience focused on modern transparency.

## Structure

- `app/` - server-rendered route shell, metadata, and global styling
- `components/` - focused client UI islands for donation, impact, causes, feed, and testimonials
- `config/payment.ts` - owner-editable Bitcoin and bank transfer configuration
- `hooks/useScrollProgress.ts` - reusable viewport progress hook
- `lib/` - reserved for Sanity, Supabase, and Stripe server integrations

## Run locally

Install Node.js 18.17+ and run:

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` when connecting the Stripe Elements flow. Server-side payment intents, Supabase donation records, and Sanity content can be added behind the existing component boundaries.

## Production checklist

1. Copy `.env.local.example` to `.env.local` on the VPS and set a unique admin username, a password of at least 12 characters, and a long random session secret.
2. Keep `.env.local` and `data/admin-credentials.json` out of Git. The existing `.gitignore` protects both.
3. Run `npm ci`, `npm run build`, and `npm run start` on the VPS.
4. Put Nginx or another reverse proxy in front of Next.js, enable HTTPS, and keep the app process running with PM2 or systemd.
5. Configure real payment processing before accepting card payments. The current public flow intentionally supports bank transfer, PayPal, and Bitcoin only.

### Important settings limitation

Payment destinations, founder profiles, and chat settings currently use browser `localStorage` as a demo admin layer. They are not shared with donors or other admin devices. Before treating the admin editor as production-ready, move these settings behind authenticated server API routes backed by a database or a protected server-side configuration store.

## Admin access

Copy `.env.local.example` to `.env.local` and replace the values with private, strong secrets:

```text
HOPEBRIDGE_ADMIN_USERNAME=admin
HOPEBRIDGE_ADMIN_PASSWORD=your-private-admin-password
HOPEBRIDGE_ADMIN_SECRET=your-long-random-session-secret
```

Restart the dev server, then open `/admin/login`. The admin session uses an expiring HttpOnly signed cookie. After signing in, use **Change admin credentials** to change the username and password. The password is stored as a salted server-side hash in `data/admin-credentials.json`, which is ignored by Git. Never commit `.env.local` or expose these values with `NEXT_PUBLIC_` variables.

GitHub does not contain the admin username, password, session secret, or generated credential hash. A fresh VPS clone will show the public site, but admin login will remain unavailable until `.env.local` is created on that VPS and the server is restarted. The login values are exactly the values set in that VPS `.env.local`; credentials from another machine do not carry over.

## GitHub and VPS deployment

From the project folder:

```bash
git init
git add .
git commit -m "Initial HopeBridge International site"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

On the VPS:

```bash
git clone https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
npm ci
cp .env.local.example .env.local
# Edit .env.local with production-only secrets.
npm run build
npm run start
```

For a quick VPS check after startup:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/admin/login
```

Both routes should return `200`. If admin login says authentication is not configured, stop the process, verify the three `HOPEBRIDGE_ADMIN_*` variables in `.env.local`, and start the app again.
