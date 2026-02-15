import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis
from typing import Generator

# Database Configuration
# Using fresh PostgreSQL container on port 5434
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://skillstream:skillstream123@localhost:5434/skillstream"
)

# Fix for Render/Heroku which might provide postgres:// but SQLAlchemy requires postgresql://
if DATABASE_URL:
    # Remove surrounding whitespace which can break parsing
    DATABASE_URL = DATABASE_URL.strip()
    
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Redis Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))

# SQLAlchemy Setup
if DATABASE_URL:
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,  # Verify connections before using
            pool_size=10,
            max_overflow=20
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base = declarative_base()
        print(f"✅ Database initialized with URL starting with: {DATABASE_URL[:15]}...")
    except Exception as e:
        print(f"❌ FAILED to create database engine. URL was: {DATABASE_URL[:20]}... Error: {e}")
        # Allow app to start even if DB fails, so we can see logs
        engine = None
        SessionLocal = None
        Base = declarative_base()
else:
    # PostgreSQL disabled - create dummy objects
    engine = None
    SessionLocal = None
    Base = declarative_base()

# Redis Setup
redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5
)

def get_db() -> Generator:
    """
    Dependency function to get database session.
    Usage: db: Session = Depends(get_db)
    """
    if SessionLocal is None:
        raise RuntimeError("Database is not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    """
    Get Redis client instance.
    """
    return redis_client

def init_db():
    """
    Initialize database tables.
    Call this on application startup.
    """
    if engine is not None:
        Base.metadata.create_all(bind=engine)

def check_db_connection() -> bool:
    """
    Check if database connection is working.
    """
    if engine is None:
        return False
    try:
        engine.connect()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def check_redis_connection() -> bool:
    """
    Check if Redis connection is working.
    """
    try:
        redis_client.ping()
        return True
    except Exception as e:
        print(f"Redis connection failed: {e}")
        return False
