from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

try:
    from .database import Base
except ImportError:
    from adapters.database import Base


# Enums
class UserRole(str, enum.Enum):
    EMPLOYEE = "Employee"
    ADMIN = "Admin"


class AssetType(str, enum.Enum):
    VIDEO = "Video"
    DOC = "Doc"
    SANDBOX = "Sandbox"


class DifficultyLevel(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class AssignmentStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In-Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"
    LOCKED = "Locked"


# Models
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # Firebase UID
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.EMPLOYEE)
    department = Column(String, nullable=False)
    learning_preference = Column(String, default="Visual")
    
    # Gamification
    streak = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    hours_learned = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="user", cascade="all, delete-orphan")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    type = Column(Enum(AssetType), nullable=False)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    topic = Column(String, nullable=False, index=True)
    tags = Column(Text)  # JSON string of tags
    duration_minutes = Column(Integer, nullable=False)
    content_url = Column(String)
    learning_objectives = Column(Text)  # JSON string of objectives
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="asset", cascade="all, delete-orphan")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String, ForeignKey("assets.id"), nullable=False, index=True)
    assigned_by = Column(String, nullable=False)  # User ID or "Self" or "AdaptiveEngine"
    
    # Status and Progress
    status = Column(Enum(AssignmentStatus), nullable=False, default=AssignmentStatus.PENDING)
    progress = Column(Integer, default=0)  # 0-100
    score = Column(Float, nullable=True)
    attempts = Column(Integer, default=0)
    
    # Dates
    assigned_date = Column(DateTime, default=datetime.utcnow)
    started_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="assignments")
    asset = relationship("Asset", back_populates="assignments")


class LearningSession(Base):
    """Track individual learning sessions for analytics"""
    __tablename__ = "learning_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String, ForeignKey("assets.id"), nullable=False, index=True)
    assignment_id = Column(String, ForeignKey("assignments.id"), nullable=True)
    
    # Session data
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)


class AdaptiveEvent(Base):
    """Track adaptive engine decisions for analytics"""
    __tablename__ = "adaptive_events"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assignment_id = Column(String, ForeignKey("assignments.id"), nullable=False)
    
    # Event data
    event_type = Column(String, nullable=False)  # "remedial", "fast_track", "continue"
    trigger_score = Column(Float, nullable=True)
    action_taken = Column(Text)  # JSON string describing the action
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
