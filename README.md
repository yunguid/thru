# My Application Portal

This project merges two core functionalities:
1. **Screenshot Processor**: Upload job-application screenshots, parse with an LLM, and store relevant job details in Supabase.
2. **Quick Cover**: Generate quick cover letters with an LLM, referencing your resume data and relevant stats.

## Tech Stack

- **TypeScript** + **Node.js** for the backend
- **GraphQL** (Apollo Server) for schema, queries, and mutations
- **React** (TypeScript) for the front-end
- **Supabase** for database + file storage
- **OpenAI** (or Anthropic) for LLM calls
- Deployed to **Vercel** (optional step)

## Features

- Upload .png/.jpg screenshots of job postings
- Extract job info using AI
- Store that info in Supabase
- Generate dynamic cover letters referencing your stats
- Simple UI with Times New Roman text, navy headings, and a beige background

## Setup

1. **Clone** and install dependencies:
   ```bash
   git clone <this_repo_url> my-application-portal
   cd my-application-portal
   npm install
