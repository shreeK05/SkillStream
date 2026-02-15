from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Standard imports without try/except block for better compatibility with uvicorn/deployment
from services.ai_engine import AIEngine
from adapters.database import (
    get_db, 
    get_redis, 
    init_db, 
    check_db_connection, 
    check_redis_connection
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events for the application.
    """
    # Startup
    print("🚀 Starting SkillStream API...")
    
    # Check database connections
    db_status = check_db_connection()
    redis_status = check_redis_connection()
    
    if db_status:
        print("✅ PostgreSQL connection successful")
        # Initialize database tables
        init_db()
        print("✅ Database tables initialized")
    else:
        print("⚠️  PostgreSQL connection failed - running without database")
    
    if redis_status:
        print("✅ Redis connection successful")
    else:
        print("⚠️  Redis connection failed - running without cache")
    
    yield
    
    # Shutdown
    print("👋 Shutting down SkillStream API...")


app = FastAPI(
    title="SkillStream API",
    description="Backend service for SkillStream: Dynamic Workforce Upskilling Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_engine = AIEngine()


@app.get("/health")
async def health_check():
    """
    Health check endpoint with database and Redis status.
    """
    db_status = check_db_connection()
    redis_status = check_redis_connection()
    
    return {
        "status": "healthy" if (db_status or redis_status) else "degraded",
        "service": "skillstream-api",
        "database": "connected" if db_status else "disconnected",
        "redis": "connected" if redis_status else "disconnected"
    }


@app.get("/health/db")
async def database_health():
    """
    Detailed database health check.
    """
    db_status = check_db_connection()
    redis_status = check_redis_connection()
    
    return {
        "postgresql": {
            "status": "healthy" if db_status else "unhealthy",
            "connected": db_status
        },
        "redis": {
            "status": "healthy" if redis_status else "unhealthy",
            "connected": redis_status
        }
    }


@app.post("/engine/evaluate")
async def evaluate_performance(user_id: str, asset_id: str, score: float):
    """
    Evaluates user performance and returns adaptive learning path updates.
    Uses AI Engine logic.
    """
    result = ai_engine.process_result(user_id, asset_id, score)
    return result


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", websocket)
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat")


if __name__ == "__main__":
    import uvicorn
    # When running directly, app is in 'main'
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
