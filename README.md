# GenAI-Powered Code Reviewer & Refactor Suggestion Tool

A comprehensive AI-powered system that automatically reviews source code, detects bugs and security vulnerabilities, suggests improvements and refactoring strategies, and provides intelligent code completion.

## 🚀 Features

- **AI-Powered Code Review**: Detect bugs, code smells, and security vulnerabilities
- **Multi-Model Support**: Switch between GPT-4, CodeLlama, Claude-3, and more
- **Refactoring Suggestions**: Get intelligent recommendations for code improvements
- **Autocomplete & Docstring Generation**: AI-generated code completion and documentation
- **Complexity Analysis**: Computational complexity scoring for code blocks
- **GitHub Integration**: Post review comments directly to pull requests
- **Review History**: Track and analyze past reviews with MongoDB logging
- **Interactive Dashboard**: Visualize code quality metrics and trends
- **Docker Deployment**: Full containerized setup with Docker Compose

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Python 3.11+, FastAPI, Pydantic, Uvicorn |
| **AI Models** | GPT-4, GPT-3.5 Turbo, CodeLlama, Claude-3 |
| **Database** | MongoDB, Redis (caching) |
| **DevOps** | Docker, Docker Compose |
| **APIs** | FastAPI REST APIs, GitHub API integration |

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)
- API keys for AI models (OpenAI, Anthropic, etc.)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd genai-code-reviewer
\`\`\`

### 2. Environment Setup

\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
nano .env
\`\`\`

### 3. Docker Deployment

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MongoDB**: localhost:27017

## 🔧 Development Setup

### Backend Development

\`\`\`bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn scripts.backend_api:app --reload --host 0.0.0.0 --port 8000
\`\`\`

### Frontend Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### Database Setup

\`\`\`bash
# Initialize MongoDB with sample data
python scripts/database_setup.py
\`\`\`

## 📖 API Documentation

### Core Endpoints

#### Code Analysis
```http
POST /api/analyze
Content-Type: application/json

{
  "code": "def example_function():\n    return None",
  "model": "gpt-4",
  "language": "python",
  "analysis_type": ["bugs", "security", "refactoring", "complexity"]
}
