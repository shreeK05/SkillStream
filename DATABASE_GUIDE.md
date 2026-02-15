# How to Get Your PostgreSQL Connection String

You need a cloud-hosted PostgreSQL database for your live application. Here are the two best free options:

## Option A: Render (Easiest if deploying Backend to Render)

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click the **New +** button and select **PostgreSQL**.
3. **Name**: `skillstream-db` (or any name).
4. **Region**: Select the same region as your Backend Web Service (important for speed).
5. **Plan**: Select **Free**.
6. Click **Create Database**.
7. Wait for it to initialize (status becomes "Available").
8. Look for the **Connections** section:
   - **Internal Connection String**: Use this if your Backend is also on Render (Faster/Secure).
     - Example: `postgres://skillstream_user:...@dpg-....render.com/skillstream`
   - **External Connection String**: Use this if you want to connect from your local computer.
9. Copy this string. This is your `DATABASE_URL`.

## Option B: Supabase (Best Free Tier & Features)

1. Go to [Supabase](https://supabase.com/) and sign in/sign up.
2. Click **New Project**.
3. **Name**: `SkillStream`.
4. **Database Password**: **IMPORTANT!** Write this down or copy it immediately. You cannot see it again.
5. Choose a region close to you.
6. Click **Create new project**.
7. Once the project is ready (green status):
   - Go to **Project Settings** (Cog icon at bottom left).
   - Click **Database**.
   - Scroll down to **Connection String**.
   - Click **URI**.
   - Copy the string. It will look like this:
     ```
     postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
   - **Crucial Step**: You must manually replace `[YOUR-PASSWORD]` with the password you created in step 4.

## How to use it

1. Go back to your **Render Web Service** dashboard.
2. Go to **Environment**.
3. Add Environment Variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the connection string you copied above.
4. Render will restart your app, and it will connect to this new cloud database.
