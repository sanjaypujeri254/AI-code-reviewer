// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

const db = db.getSiblingDB("genai_code_reviewer")

// Create collections
db.createCollection("reviews")
db.createCollection("users")
db.createCollection("models")

// Create indexes for better performance
db.reviews.createIndex({ timestamp: -1 })
db.reviews.createIndex({ user_id: 1 })
db.reviews.createIndex({ model: 1 })
db.reviews.createIndex({ status: 1 })
db.reviews.createIndex({ filename: "text" })

db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ created_at: -1 })

// Insert sample data
db.users.insertMany([
  {
    email: "john.doe@company.com",
    name: "John Doe",
    role: "senior_developer",
    preferences: {
      default_model: "gpt-4",
      auto_pr_comments: true,
    },
    created_at: new Date(),
    last_login: new Date(),
  },
  {
    email: "jane.smith@company.com",
    name: "Jane Smith",
    role: "tech_lead",
    preferences: {
      default_model: "claude-3",
      auto_pr_comments: false,
    },
    created_at: new Date(),
    last_login: new Date(),
  },
])

db.models.insertMany([
  {
    name: "gpt-4",
    provider: "openai",
    capabilities: ["code_review", "refactoring", "docstring", "autocomplete"],
    cost_per_token: 0.00003,
    max_tokens: 8192,
    active: true,
  },
  {
    name: "gpt-3.5-turbo",
    provider: "openai",
    capabilities: ["code_review", "refactoring", "autocomplete"],
    cost_per_token: 0.000002,
    max_tokens: 4096,
    active: true,
  },
  {
    name: "codellama",
    provider: "meta",
    capabilities: ["code_review", "autocomplete"],
    cost_per_token: 0.000001,
    max_tokens: 2048,
    active: true,
  },
  {
    name: "claude-3",
    provider: "anthropic",
    capabilities: ["code_review", "refactoring", "docstring"],
    cost_per_token: 0.000015,
    max_tokens: 4096,
    active: true,
  },
])

print("Database initialized successfully with sample data")
