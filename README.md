# MH Accessories

Online men's & women's accessories store (bags, watches, belts, sunglasses, wallets, bracelets) with an admin panel (Node.js + Express + MongoDB).

## Run locally

```bash
npm install
npm start
```

- Store: http://localhost:3000  
- Admin: http://localhost:3000/admin  
- Default admin password: `MH2026`

## Free hosting (Render)

This app needs a **Node server** (not GitHub Pages alone).

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mh-accessories.git
git push -u origin main
```

### 2. Deploy on Render (free)

1. Go to [https://render.com](https://render.com) and sign up (GitHub login is easiest).
2. **New +** → **Web Service** → connect your GitHub repo.
3. Settings (Render may auto-detect from `render.yaml`):
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Plan:** Free
4. Click **Create Web Service**. Wait until status is **Live**.
5. Open your URL, e.g. `https://mh-accessories.onrender.com`
   - Store: `https://YOUR-APP.onrender.com`
   - Admin: `https://YOUR-APP.onrender.com/admin`

### Free tier notes

- The site **sleeps** after ~15 minutes with no traffic; the first visit may take 30–60 seconds to wake up.
- Uploaded images and new orders are stored in MongoDB / Cloudinary; make sure `MONGODB_URI` and the `CLOUDINARY_*` environment variables are set.
- Change the admin password from the admin panel after going live.

## Other free options

| Platform | Works? | Notes |
|----------|--------|--------|
| **Render** | Yes | Easiest for this repo; use steps above |
| **Railway** | Yes | Free trial credits, then paid |
| **Fly.io** | Yes | CLI deploy, small free allowance |
| **GitHub Pages** | No | Static only — no `/api` backend |

## Troubleshooting admin login

- **Server connection error** → backend is not running or wrong URL. Locally: run `npm start`. Online: open the Render URL, not a local HTML file.
- **Wrong password** → default is `MH2026` unless you changed it in admin settings.

## Product photos

The catalog ships with clean placeholder illustrations (`Public/images/products/*.svg`) for each accessory category so the store looks complete out of the box. Replace them with real product photography any time from the admin panel (**Products → Add/Edit → upload images**) — no code changes needed.
