FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if needed (e.g. for psycopg2)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port (Render/Heroku often use $PORT, but we'll default to 8000)
ENV PORT=8000
EXPOSE 8000

# Use shell form to allow variable expansion if needed, but exec form is preferred.
# We'll use a CMD that respects the PORT env var if possible, 
# or just standard uvicorn.
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
