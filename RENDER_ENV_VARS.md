# How to Add Environment Variables in Render

You are likely looking for the **Environment** tab in your Render Web Service dashboard.

## Step-by-Step Instructions

1.  **Log in** to your [Render Dashboard](https://dashboard.render.com/).
2.  **Click** on the Web Service you created (e.g., `skillstream-backend`).
3.  On the left-hand sidebar (or top menu on mobile), look for **"Environment"**. Click it.
4.  You will see a button labeled **"Add Environment Variable"**. Click it.
5.  Two boxes will appear. Fill them out as follows:

    ### Variable 1: Database URL
    *   **Key**: `DATABASE_URL`
    *   **Value**: Paste your full PostgreSQL connection string here (starting with `postgres://...`).
        *   *If you are using Render's database, go to your Dashboard -> Postgres -> Connect -> Internal Connection String to copy it.*

    ### Variable 2: Port
    *   **Click "Add Environment Variable" again.**
    *   **Key**: `PORT`
    *   **Value**: `8000`

6.  Click **"Save Changes"** at the bottom.

Render will automatically restart your service with these new settings.
