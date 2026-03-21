# AI Resume Screening System

A modern, full-stack ATS (Applicant Tracking System) powered by Artificial Intelligence. This platform automatically screens candidates, extracts structured data from resumes, runs deep semantic matchmaking against job requirements, and provides actionable insights for recruiters.

## 🚀 The Recruitment Process Flow

1. **Job Creation (Recruiter Portal):** Recruiters log in, post detailed job descriptions, and specify required skills. The system automatically calculates vector embeddings of the job requirements.
2. **Candidate Application (Applicant Portal):** Applicants browse the open roles and apply by uploading their CVs (supporting `.pdf` and `.docx`).
3. **AI Data Extraction:** The platform natively rips the raw text from the document and strictly structures it (Education, Experience, extracted Skills) using a fast Groq LLM JSON pipeline.
4. **Hybrid AI Scoring Engine:**
   - **Keyword Scoring (40% Weight):** Direct overlap comparisons against the recruiter's required skills.
   - **Semantic Similarity (60% Weight):** OpenAI text embeddings (`text-embedding-3-small`) run cosine similarity mapping comparing the candidate's career trajectory against the core job description.
5. **Qualitative AI Reasoning:** The LLM generates human-readable "Match Insights", highlighting the applicant's **Core Strengths**, **Key Gaps**, and an ultimate **Recommendation** (Strong Fit, Moderate Fit, Not Fit).
6. **Dashboard Review:** Recruiters review candidates in an overarching dashboard sorted automatically by suitability. They can blind-screen, read AI summaries, preview the native PDFs, and Shortlist or Reject candidates with a single click. Applicants track these status updates directly from their applicant dashboard.

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`
- **Authentication & Database:** Supabase, robust PostgreSQL Row-Level Security (RLS) policies, built-in Vector/`pgvector` indexing.
- **AI / LLMs:**
  - **Groq:** Lightning-fast inference for structuring messy resumes.
  - **OpenAI:** Used for deep semantic vector embeddings.
- **Document Processing:** `pdf-parse` (PDF extraction) & `mammoth` (DOCX extraction)
- **Icons & UI:** Lucide React, structured modern UI components (similar to shadcn/ui).

## 📂 Folder Structure

The project strictly follows the Next.js App Router paradigm, neatly decoupling roles through segregated layouts.

```text
resume-screening/
├── app/
│   ├── actions/       # Server Actions (Secure database mutations, Resume processing)
│   ├── admin/         # Super-admin portal (Monitor all users and global stats)
│   ├── applicant/     # Applicant Portal (Job Board, Apply, Application Dashboard)
│   ├── auth/          # Supabase Auth callback routers
│   ├── login/         # Unified Secure Authentication UI
│   └── recruiter/     # Targeted Recruiter Dashboard (Job creation, Candidate lists, AI evaluation panels)
├── components/
│   ├── dashboard/     # Shared business logic components (ResumeUpload, OverviewCards, Chat)
│   └── ui/            # Reusable atomic design system (Buttons, Badges, Cards)
├── lib/               # Utility functions, Supabase Client/Server boundary instances
├── services/          # Pure backend domain logic
│   ├── ai-evaluator.ts# Connects to Groq & OpenAI to digest CV data
│   ├── resume-parser.ts # Buffer extraction wrappers for PDF/DOCX
│   └── scoring.ts     # Mathematical vector similarity & weighting logic
├── supabase/
│   └── migrations/    # Version-controlled SQL schema logic and Vector index provisioning
└── next.config.ts     # Specialized custom Webpack ignore settings for Web Workers (pdf.worker.mjs)
```

## 🛠️ Getting Started

First, populate your environment variables in `.env.local` by securely copying over your API keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
```

Then, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the application.

## 👨‍💻 Author

Developed and maintained by **Rahul Choudhary**.
