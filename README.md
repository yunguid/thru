# My Application Portal

This project merges two core functionalities:
1. **Screenshot Processor**: Upload job-application screenshots, parse with an LLM, and store relevant job details in PostgreSQL.
2. **Quick Cover**: Generate quick cover letters with an LLM, referencing your resume data and relevant stats.

## Tech Stack

- **TypeScript** + **Node.js** for the backend
- **GraphQL** (Apollo Server) for schema, queries, and mutations
- **React** (TypeScript) + **Tailwind** for the front-end
- **PostgreSQL** (Supabase's Postgres image) for database
- **OpenAI GPT-4o** for LLM processing
- **Docker** for database containerization
- **Vite** for frontend build

## Features

- Upload .png/.jpg screenshots of job postings
- Extract job info using GPT-4 Vision

- Store that info in PostgreSQL
- Generate dynamic cover letters
- Clean UI with Tailwind styling

## Setup

1. **Clone** and install dependencies:
   ```bash
   git clone <this_repo_url> my-application-portal
   cd my-application-portal
   npm install
   ```

2. **Start Postgres**:
   ```bash
   docker-compose up -d
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Add your OpenAI API key and DB credentials
   ```
