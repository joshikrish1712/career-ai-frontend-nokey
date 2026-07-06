# CareerAI — Frontend

A top-level React frontend for the AI Career Assistant, inspired by Zety/Resume.io with a distinctive design.

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero, features, testimonials, CTA |
| `/ats-checker` | ATS Checker | Upload PDF, get score + breakdown |
| `/cover-letter` | Cover Letter | AI-powered cover letter generator |
| `/builder` | Resume Builder | 5-step wizard with live preview |
| `/dashboard` | Dashboard | Saved resumes & letters |

## Setup

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://127.0.0.1:8000
```

## Backend Connection

This frontend connects to the FastAPI backend at `REACT_APP_API_URL`.

Required backend endpoints:
- `POST /resume/upload` — PDF upload + ATS analysis
- `POST /cover-letter/generate` — Cover letter generation
- `POST /auth/login` — User login
- `POST /auth/register` — User registration

The Cover Letter page calls the Anthropic API directly from the browser for demo purposes.
In production, route all AI calls through your FastAPI backend with your API key stored server-side.

## Tech Stack

- React 18 + React Router v6
- Tailwind CSS 3
- Lucide React icons
- Axios
- Google Fonts: Sora (display) + DM Sans (body)
