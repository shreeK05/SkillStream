"""
Test script to verify PostgreSQL and Redis connections
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from adapters.database import check_db_connection, check_redis_connection, init_db
    
    print("🔍 Testing Database Connections...")
    print("=" * 50)
    
    # Test PostgreSQL
    print("\n📊 PostgreSQL Connection:")
    db_status = check_db_connection()
    if db_status:
        print("✅ PostgreSQL: CONNECTED (Port 5433)")
        print("   Initializing tables...")
        try:
            init_db()
            print("✅ Tables: INITIALIZED")
        except Exception as e:
            print(f"⚠️  Tables initialization warning: {e}")
    else:
        print("❌ PostgreSQL: DISCONNECTED")
        print("   Please check:")
        print("   - Docker container is running: docker ps")
        print("   - Port 5433 is accessible")
    
    # Test Redis
    print("\n🔴 Redis Connection:")
    redis_status = check_redis_connection()
    if redis_status:
        print("✅ Redis: CONNECTED (Port 6379)")
    else:
        print("❌ Redis: DISCONNECTED")
        print("   Please check:")
        print("   - Docker container is running: docker ps")
        print("   - Port 6379 is accessible")
    
    print("\n" + "=" * 50)
    if db_status and redis_status:
        print("🎉 All connections successful!")
        print("\n✅ Your backend is ready to use:")
        print("   cd backend")
        print("   python main.py")
    elif db_status or redis_status:
        print("⚠️  Partial success - some services connected")
        print("   Backend will run in degraded mode")
    else:
        print("❌ No database connections available")
        print("   Please start Docker containers:")
        print("   docker-compose up -d")
    
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("\nPlease install dependencies:")
    print("   cd backend")
    print("   pip install -r requirements.txt")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
