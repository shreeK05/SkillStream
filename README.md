# SkillStream – Dynamic Workforce Upskilling Engine

## Problem Statement
In a rapidly changing corporate environment, employees need to acquire new technical skills, but a "one-size-fits-all" training manual is inefficient. SkillStream builds a dynamic professional development track that adjusts based on an employee's background and real-time training performance.

## Core Features
1. **Asset Catalog**: Manage a library of corporate resources (videos, technical docs, sandboxes) tagged by difficulty and format.
2. **Employee Profiling**: Track progress via simulation scores, time-to-completion, and preferred media type.
3. **Path Logic (AI Engine)**: Re-sequences training modules if an employee struggles or excels.
4. **Professional Dashboard**: Shows "Current Certification Path," "Estimated Time to Completion," and recommendations.

## Tech Stack
-   **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Lucide Icons.
-   **Backend**: FastAPI, Python, SQLAlchemy.
-   **Database**: PostgreSQL, Redis.
-   **Authentication**: Firebase Authentication (Email/Password, Google OAuth).
-   **User Data**: Cloud Firestore.
-   **AI Engine**: Scikit-Learn, Transformers logic.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Running the Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

**Note**: Firebase Authentication is pre-configured. Users can sign up/login with email/password or Google OAuth. See [FIREBASE_AUTH.md](./FIREBASE_AUTH.md) for details.

### Setting Up Databases (PostgreSQL & Redis)

**Option 1: Docker (Recommended)**
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Start databases:
   ```bash
   docker-compose up -d
   ```
3. Verify:
   ```bash
   docker ps
   ```

**Option 2: Local Installation**  
See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

### Running the Backend (Reference)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the API server:
   ```bash
   python main.py
   ```

## Deployment
Ready for deployment on AWS (Backend) and Vercel (Frontend).
