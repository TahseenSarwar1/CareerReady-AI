# CareerReady AI

CareerReady AI is a full-stack interview preparation app. Candidates provide a job description and a PDF resume, with an optional self-description. The app uses Google Gemini to create a tailored interview report, saves reports to MongoDB, and can generate a job-specific resume as a downloadable PDF.

## Features

- Account registration, sign-in, and sign-out using JWT authentication.
- PDF resume upload (up to 3 MB) and job-description input.
- AI-generated interview report with a role match score, technical and behavioral questions, answer guidance, skill gaps, and a day-by-day preparation plan.
- Saved reports that can be revisited from the dashboard.
- Job-tailored resume generation and PDF download.
- React single-page interface backed by an Express API and MongoDB.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Sass |
| Backend | Node.js, Express 5, Mongoose, Multer |
| AI and documents | Google Gemini API, Zod response schema, pdf-parse, Puppeteer |
| Authentication | JSON Web Tokens, bcryptjs, cookie-parser |

## Project structure

```text
CareerReady-AI/
├── Backend/
│   ├── server.js                 # Starts the API and connects to MongoDB
│   └── src/
│       ├── config/               # Database connection
│       ├── controllers/          # Authentication and interview handlers
│       ├── middlewares/          # JWT authentication and file upload
│       ├── models/               # Users, reports, and revoked tokens
│       ├── routes/               # Express API routes
│       └── services/             # Gemini report and PDF generation
├── Frontend/
│   └── src/
│       ├── components/           # Shared navigation and toast components
│       ├── contexts/             # Shared application state
│       └── features/             # Authentication and interview screens
└── README.md
```

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- A MongoDB instance, local or hosted
- A Google Gemini API key

## Setup

Install dependencies for both applications:

```bash
cd Backend
npm ci

cd ../Frontend
npm ci
```

Create `Backend/.env` with your local MongoDB connection and Gemini API key:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/interview-ai
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_GENAI_API_KEY=your-google-gemini-api-key
# Optional. Defaults to gemini-flash-lite-latest.
GEMINI_MODEL=gemini-flash-lite-latest
```

Keep API keys and secrets in `Backend/.env`; do not put them in frontend files or commit them to Git. The backend currently uses port `3000`, and the Vite frontend uses port `5173`.

## Run locally

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API health endpoint is [http://localhost:3000](http://localhost:3000). MongoDB and the Gemini API must be available for report generation.

## Application routes

| Frontend route | Description |
| --- | --- |
| `/register` | Create an account |
| `/login` | Sign in |
| `/` | Create an interview report and review saved reports (requires sign-in) |
| `/interview/:interviewId` | Review a report and download a tailored resume (requires sign-in) |

## API overview

The API is served from `http://localhost:3000`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | API health response |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/get-me` | Get the signed-in user |
| `POST` | `/api/interview/` | Generate and save a report (`multipart/form-data`; `resume` PDF, `jobDescription`, optional `selfDescription`) |
| `GET` | `/api/interview/` | List the signed-in user's reports |
| `GET` | `/api/interview/report/:interviewId` | Get one of the signed-in user's reports |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate and download a resume PDF |

Interview report routes require authentication. Resume uploads are limited to 3 MB.

## Available scripts

Run these from `Frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | Run ESLint |

Run `npm run dev` from `Backend/` to start the API with Nodemon. Automated tests are not currently configured.

## Current development configuration

The frontend API client targets `http://localhost:3000`, and the backend CORS configuration allows `http://localhost:5173`. Update these values before deploying the frontend and API to other origins.
