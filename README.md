# Project Setup

This project uses a Python backend and a Vue + Vite frontend.

## Tech stack used

### Frontend
- Vue 3
- Vite
- Vue Router
- Vue I18n
- Axios
- D3

### Backend
- Flask
- Flask-CORS
- OpenAI Python SDK
- Zep Cloud
- CAMEL OASIS / CAMEL-AI
- PyMuPDF
- python-dotenv
- pydantic

### Build / tooling
- Node.js 18+
- Python 3.11+
- uv (recommended)
- Docker (optional)

## Dependencies to install

### 1. Node.js dependencies
```bash
npm install
cd frontend
npm install
```

### 2. Python dependencies
Recommended:
```bash
cd backend
uv sync
```

Alternative with pip:
```bash
cd backend
pip install -r requirements.txt
```

## Environment variables

Create a `.env` file in the project root using the example file:

```bash
cp .env.example .env
```

Required values:

```env
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus
ZEP_API_KEY=your_zep_api_key
```

## How to run

### Run both frontend and backend together
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Run services individually
```bash
npm run backend
npm run frontend
```

### Optional Docker run
```bash
docker compose up -d
```

## Project scripts

From the project root:

```bash
npm run setup
npm run setup:backend
npm run setup:all
npm run dev
npm run backend
npm run frontend
npm run build
```

## Notes

- The backend expects Python 3.11+.
- The frontend expects Node.js 18+.
- If you do not use uv, install the backend dependencies with `pip install -r backend/requirements.txt`.
- Docker is optional; the source-code workflow is the main development path.
