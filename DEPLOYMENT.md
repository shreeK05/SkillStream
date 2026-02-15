# Deployment Guide

## 1. Frontend Deployment (Vercel/Netlify)

The frontend is a Vite + React application.

### Build
Run the build command to generate static files:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Environment Variables
Ensure the following variables are set in your deployment environment:
- `VITE_API_URL`: The URL of your deployed backend (e.g., `https://api.skillstream.com`)

## 2. Backend Deployment (AWS/Heroku/Render)

The backend is a FastAPI application using Python 3.10+.

### Docker (Recommended)
Create a `Dockerfile` in the `backend/` directory:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Manual Deployment
1. **Install Dependencies**: `pip install -r requirements.txt`
2. **Run Server**: `uvicorn main:app --host 0.0.0.0 --port 8000`

## 3. Database (PostgreSQL)

- Provision a PostgreSQL database (e.g., RDS, Supabase, Neon).
- Set the `DATABASE_URL` environment variable in the backend service.

## 4. AI Model Hosting

- The current AI Engine uses lightweight transformers. For heavy workloads, consider deploying the AI Engine as a separate microservice on a GPU-optimized instance.
