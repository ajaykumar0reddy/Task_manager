# Student Task Management System

A small, full-stack Next.js application designed for a DevOps CI/CD lab evaluation. It allows students to manage their daily assignments and lab tasks.

## Tech Stack
- Frontend: Next.js 14 (App Router), React, CSS Modules
- Backend: Next.js API Routes
- Database: SQLite (via `better-sqlite3`)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

### Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.

## Docker Deployment

This application includes a production-ready `Dockerfile` based on the Node Alpine image.

### Build the Docker Image
```bash
docker build -t student-task-manager .
```

### Run the Docker Container
```bash
docker run -p 3000:3000 student-task-manager
```
Then visit `http://localhost:3000` in your browser

## CI/CD Pipeline
This project is suitable for integration into a Jenkins pipeline. The standard workflow includes:
- Source code checkout from GitHub
- Installing dependencies (`npm install`)
- Linting (`npm run lint`)
- Building (`npm run build`)
- Docker image building and pushing to a registry
- Trivy vulnerability scanning
- Deployment
