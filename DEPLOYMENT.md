# SkillStream Deployment Guide

Your code is now live on GitHub: [https://github.com/shreeK05/SkillStream](https://github.com/shreeK05/SkillStream)

Follow these steps to deploy your full-stack application.

## 1. Deploy Backend (Render / Railway)

We recommend **Render** or **Railway** for free-tier hosting of the Python backend.

### Option A: Render (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `shreeK05/SkillStream`.
4. Name: `skillstream-backend`.
5. Configuration:
   - **Environment**: Docker
   - **Region**: Closest to you (e.g., Singapore/Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend` (Important! This tells Render where the Dockerfile is)
6. **Environment Variables**:
   - Add `DATABASE_URL`: `[Your PostgreSQL Connection String]` (Use Render's PostgreSQL service or Supabase)
   - Add `PORT`: `8000`
7. Click **Create Web Service**.
8. Copy the deployed URL (e.g., `https://skillstream-backend.onrender.com`).

### Option B: Railway
1. Go to [Railway](https://railway.app/).
2. **New Project** -> **Deploy from GitHub repo**.
3. Select `shreeK05/SkillStream`.
4. Add a PostgreSQL database service.
5. In the `skillstream-backend` service, go to **Variables**, add `DATABASE_URL` (Reference the PostgreSQL service).
6. Copy the public domain.

## 2. Deploy Frontend (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import `shreeK05/SkillStream`.
4. Framework Preset: **Vite** (Should be auto-detected).
5. **Environment Variables**:
   - `VITE_API_URL`: Paste your backend URL from Step 1 (e.g., `https://skillstream-backend.onrender.com`).
6. Click **Deploy**.

## 3. Final Integration

1. Once frontend is deployed, copy its URL (e.g., `https://skillstream.vercel.app`).
2. Go back to your Backend dashboard (Render/Railway).
3. If using `CORS_ORIGINS` variable, add your frontend URL there.
4. Verify the application works by signing up a new user.
