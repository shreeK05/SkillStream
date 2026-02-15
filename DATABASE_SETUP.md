# Database Setup Guide - PostgreSQL & Redis

This guide will help you set up PostgreSQL and Redis for the SkillStream backend.

## 🐳 Option 1: Docker Setup (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Steps

1. **Start the databases:**
   ```bash
   docker-compose up -d
   ```

2. **Verify containers are running:**
   ```bash
   docker ps
   ```
   
   You should see:
   - `skillstream_postgres` on port 5432
   - `skillstream_redis` on port 6379

3. **Check logs (if needed):**
   ```bash
   docker-compose logs postgres
   docker-compose logs redis
   ```

4. **Stop the databases:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove data (reset):**
   ```bash
   docker-compose down -v
   ```

### Database Credentials (Docker)
```
PostgreSQL:
  Host: localhost
  Port: 5432
  Database: skillstream_db
  User: skillstream_user
  Password: skillstream_pass

Redis:
  Host: localhost
  Port: 6379
  DB: 0
```

---

## 💻 Option 2: Local Installation

### Windows

#### PostgreSQL
1. Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Set password for `postgres` user
4. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE skillstream_db;
   CREATE USER skillstream_user WITH PASSWORD 'skillstream_pass';
   GRANT ALL PRIVILEGES ON DATABASE skillstream_db TO skillstream_user;
   \q
   ```

#### Redis
1. Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
2. Extract and run `redis-server.exe`
3. Or use WSL2:
   ```bash
   wsl
   sudo apt update
   sudo apt install redis-server
   sudo service redis-server start
   ```

### macOS

#### PostgreSQL
```bash
brew install postgresql@15
brew services start postgresql@15
createdb skillstream_db
```

#### Redis
```bash
brew install redis
brew services start redis
```

### Linux (Ubuntu/Debian)

#### PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
CREATE DATABASE skillstream_db;
CREATE USER skillstream_user WITH PASSWORD 'skillstream_pass';
GRANT ALL PRIVILEGES ON DATABASE skillstream_db TO skillstream_user;
\q
```

#### Redis
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

---

## 🔧 Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials if different from defaults.

### 3. Start the Backend

```bash
python main.py
```

You should see:
```
🚀 Starting SkillStream API...
✅ PostgreSQL connection successful
✅ Database tables initialized
✅ Redis connection successful
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## ✅ Verify Setup

### 1. Check Health Endpoint

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "skillstream-api",
  "database": "connected",
  "redis": "connected"
}
```

### 2. Check Detailed Database Health

```bash
curl http://localhost:8000/health/db
```

Expected response:
```json
{
  "postgresql": {
    "status": "healthy",
    "connected": true
  },
  "redis": {
    "status": "healthy",
    "connected": true
  }
}
```

### 3. Check Database Tables

**PostgreSQL:**
```bash
# Docker
docker exec -it skillstream_postgres psql -U skillstream_user -d skillstream_db

# Local
psql -U skillstream_user -d skillstream_db

# List tables
\dt

# You should see:
# - users
# - assets
# - assignments
# - learning_sessions
# - adaptive_events
```

**Redis:**
```bash
# Docker
docker exec -it skillstream_redis redis-cli

# Local
redis-cli

# Test
PING
# Should return: PONG
```

---

## 📊 Database Schema

### Tables Created

1. **users** - User profiles (synced with Firebase)
   - id (Firebase UID)
   - name, email, role, department
   - learning_preference
   - streak, xp, avg_score, hours_learned

2. **assets** - Learning resources
   - id, title, description
   - type, difficulty, topic
   - tags, duration_minutes
   - content_url, learning_objectives

3. **assignments** - User-Asset assignments
   - id, user_id, asset_id
   - assigned_by, status, progress
   - score, attempts
   - assigned_date, started_date, completed_date

4. **learning_sessions** - Session tracking
   - id, user_id, asset_id, assignment_id
   - started_at, ended_at, duration_minutes
   - completed

5. **adaptive_events** - AI engine decisions
   - id, user_id, assignment_id
   - event_type, trigger_score, action_taken

---

## 🔍 Troubleshooting

### PostgreSQL Connection Failed

**Error:** `could not connect to server: Connection refused`

**Solutions:**
- Ensure PostgreSQL is running: `docker ps` or `pg_isready`
- Check port 5432 is not in use: `netstat -an | findstr 5432`
- Verify credentials in `.env` file
- Check firewall settings

### Redis Connection Failed

**Error:** `Error connecting to Redis`

**Solutions:**
- Ensure Redis is running: `docker ps` or `redis-cli ping`
- Check port 6379 is not in use: `netstat -an | findstr 6379`
- Verify REDIS_HOST and REDIS_PORT in `.env`

### Tables Not Created

**Error:** `relation "users" does not exist`

**Solutions:**
- Check backend startup logs for errors
- Manually run: `init_db()` in Python console
- Verify database permissions

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'sqlalchemy'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

## 🎯 Next Steps

After successful setup:

1. ✅ **Migrate Data** - Move mock data to PostgreSQL
2. ✅ **Create API Endpoints** - CRUD operations for users, assets, assignments
3. ✅ **Integrate with Frontend** - Update frontend to use backend API
4. ✅ **Add Firebase Admin SDK** - Verify JWT tokens
5. ✅ **Implement Caching** - Use Redis for session and data caching

---

## 📚 Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
