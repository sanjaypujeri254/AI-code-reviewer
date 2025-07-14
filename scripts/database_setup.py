"""
MongoDB Database Setup and Models
Handles database connections and data models for the GenAI Code Reviewer
"""

from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Any, Optional
import os
from dataclasses import dataclass, asdict
import json

# MongoDB connection configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "genai_code_reviewer"

class DatabaseManager:
    def __init__(self):
        self.client = MongoClient(MONGODB_URL)
        self.db = self.client[DATABASE_NAME]
        self.reviews_collection = self.db.reviews
        self.users_collection = self.db.users
        self.models_collection = self.db.models
        
        # Create indexes for better performance
        self.create_indexes()
    
    def create_indexes(self):
        """Create database indexes for optimal query performance"""
        # Reviews collection indexes
        self.reviews_collection.create_index("timestamp")
        self.reviews_collection.create_index("user_id")
        self.reviews_collection.create_index("model")
        self.reviews_collection.create_index("status")
        self.reviews_collection.create_index([("filename", "text")])
        
        # Users collection indexes
        self.users_collection.create_index("email", unique=True)
        self.users_collection.create_index("created_at")
    
    def insert_review(self, review_data: Dict[str, Any]) -> str:
        """Insert a new code review record"""
        review_data["created_at"] = datetime.utcnow()
        review_data["updated_at"] = datetime.utcnow()
        
        result = self.reviews_collection.insert_one(review_data)
        return str(result.inserted_id)
    
    def get_review_by_id(self, review_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific review by ID"""
        from bson import ObjectId
        return self.reviews_collection.find_one({"_id": ObjectId(review_id)})
    
    def get_reviews_by_user(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get reviews for a specific user"""
        return list(self.reviews_collection.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(limit))
    
    def get_recent_reviews(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get most recent reviews across all users"""
        return list(self.reviews_collection.find().sort("timestamp", -1).limit(limit))
    
    def update_review_status(self, review_id: str, status: str, results: Dict[str, Any] = None):
        """Update review status and results"""
        from bson import ObjectId
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow()
        }
        if results:
            update_data["results"] = results
        
        self.reviews_collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": update_data}
        )
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get aggregated statistics for dashboard"""
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_reviews": {"$sum": 1},
                    "total_bugs": {"$sum": "$results.bugs_count"},
                    "total_security": {"$sum": "$results.security_count"},
                    "avg_complexity": {"$avg": "$results.complexity"}
                }
            }
        ]
        
        result = list(self.reviews_collection.aggregate(pipeline))
        if result:
            stats = result[0]
            stats.pop("_id")
            return stats
        
        return {
            "total_reviews": 0,
            "total_bugs": 0,
            "total_security": 0,
            "avg_complexity": 0
        }
    
    def search_reviews(self, query: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Search reviews with text query and filters"""
        search_filter = {}
        
        if query:
            search_filter["$text"] = {"$search": query}
        
        if filters:
            if filters.get("status"):
                search_filter["status"] = filters["status"]
            if filters.get("model"):
                search_filter["model"] = filters["model"]
            if filters.get("user_id"):
                search_filter["user_id"] = filters["user_id"]
            if filters.get("date_from"):
                search_filter["timestamp"] = {"$gte": filters["date_from"]}
            if filters.get("date_to"):
                if "timestamp" in search_filter:
                    search_filter["timestamp"]["$lte"] = filters["date_to"]
                else:
                    search_filter["timestamp"] = {"$lte": filters["date_to"]}
        
        return list(self.reviews_collection.find(search_filter).sort("timestamp", -1))
    
    def insert_user(self, user_data: Dict[str, Any]) -> str:
        """Insert a new user record"""
        user_data["created_at"] = datetime.utcnow()
        user_data["last_login"] = datetime.utcnow()
        
        result = self.users_collection.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email address"""
        return self.users_collection.find_one({"email": email})
    
    def update_user_last_login(self, user_id: str):
        """Update user's last login timestamp"""
        from bson import ObjectId
        self.users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"last_login": datetime.utcnow()}}
        )

# Data models for type safety
@dataclass
class ReviewRequest:
    user_id: str
    filename: str
    code: str
    model: str
    language: str
    analysis_types: List[str]

@dataclass
class ReviewResult:
    review_id: str
    bugs: List[str]
    security_issues: List[str]
    refactoring_suggestions: List[str]
    complexity_score: float
    docstring: Optional[str]
    autocomplete_suggestion: Optional[str]
    model_used: str
    processing_time: float

@dataclass
class User:
    email: str
    name: str
    role: str = "developer"
    preferences: Dict[str, Any] = None

def initialize_database():
    """Initialize database with sample data"""
    db_manager = DatabaseManager()
    
    # Sample users
    sample_users = [
        {
            "email": "john.doe@company.com",
            "name": "John Doe",
            "role": "senior_developer",
            "preferences": {"default_model": "gpt-4", "auto_pr_comments": True}
        },
        {
            "email": "jane.smith@company.com",
            "name": "Jane Smith",
            "role": "tech_lead",
            "preferences": {"default_model": "claude-3", "auto_pr_comments": False}
        }
    ]
    
    for user in sample_users:
        existing_user = db_manager.get_user_by_email(user["email"])
        if not existing_user:
            db_manager.insert_user(user)
    
    # Sample reviews
    sample_reviews = [
        {
            "user_id": "john.doe@company.com",
            "filename": "auth_service.py",
            "model": "gpt-4",
            "language": "python",
            "status": "completed",
            "timestamp": datetime.utcnow(),
            "results": {
                "bugs_count": 3,
                "security_count": 2,
                "refactoring_count": 4,
                "complexity": 7.2,
                "bugs": ["Null pointer exception", "Memory leak", "Race condition"],
                "security_issues": ["SQL injection", "XSS vulnerability"],
                "refactoring_suggestions": ["Extract method", "Reduce complexity", "Add error handling", "Improve naming"]
            }
        },
        {
            "user_id": "jane.smith@company.com",
            "filename": "data_processor.js",
            "model": "codellama",
            "language": "javascript",
            "status": "completed",
            "timestamp": datetime.utcnow(),
            "results": {
                "bugs_count": 1,
                "security_count": 0,
                "refactoring_count": 3,
                "complexity": 5.8,
                "bugs": ["Undefined variable"],
                "security_issues": [],
                "refactoring_suggestions": ["Use const instead of var", "Add JSDoc comments", "Optimize loop"]
            }
        }
    ]
    
    for review in sample_reviews:
        db_manager.insert_review(review)
    
    print("Database initialized with sample data")

if __name__ == "__main__":
    initialize_database()
