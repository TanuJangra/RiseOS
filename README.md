# RISE OS — Executive Communication & Speech Operating System

**RISE OS** is an intelligent, editorial-grade speech and communication fitness operating system designed for professionals, founders, leaders, and speakers. It transforms communication training through personalized 15-minute daily micro-workouts, AI-driven speech evaluation, contextual vocabulary acquisition, and an interactive expert knowledge engine.

---

## ✨ Core Highlights & Features

### 1. ⏱️ 15-Minute Daily Micro-Workouts
- **Structured 4-Step Regimen**:
  1. **Vocabulary Booster & Word of the Day**: High-impact words with pronunciation guides, etymology, and contextual sentence templates.
  2. **Elevated Articulation & Enunciation**: Targeted phonetic and tongue-placement drills to eliminate mumbling and enhance crisp delivery.
  3. **High-Stakes Speaking Drill**: Executive communication frameworks (*PREP*, *STAR*, *Pyramid Principle*) with real-time speech-to-text transcription and instant AI scoring.
  4. **Reflective Quick Check**: Retention check and actionable speaking tips for next meetings.
- **Dynamic Field Personalization**: Tailored for Tech & Leadership, Product & Design, Finance & Strategy, Healthcare, Law & Policy, or Custom Domains.

### 2. 🎙️ AI Speech & Storytelling Arena
- **Real-Time Voice Analysis**: Live audio transcription using the Web Speech Recognition API with automatic filler word counting (`um`, `uh`, `like`, `you know`, `actually`).
- **Framework Feedback**: Instant multi-dimensional scoring on Clarity, Gravitas, Structure, Pace, and Vocabulary.
- **"10/10 Executive Polish" Rewrites**: Side-by-side comparison showing how an executive coach would refine your exact answer.
- **Sentence Elevator**: Transform weak or apologetic phrases (*"Sorry to bother you..."*) into assertive, polished executive statements.

### 3. 🔍 SEEK — Executive Communication Knowledge Engine
- **Targeted Insights**: Query scenarios like *handling hostile questions*, *salary negotiation*, *conquering stage fright*, or *boardroom presence*.
- **Seminal Literature & Frameworks**: Synthesizes lessons from classics like *Crucial Conversations*, *The Charisma Myth*, *Talk Like TED*, and *Thinking, Fast and Slow*.
- **Interactive Roleplay Scripts**: Word-for-word tactical responses and counter-questions ready to deploy in real meetings.

### 4. 📚 Vocab Master Bank & Flashcards
- **Spaced Repetition & Audio Pronunciation**: Built-in speech synthesis (Web Speech API) with customizable pitch and rate.
- **Mastery Levels**: Track acquisition from "New" to "Practicing" to "Mastered".
- **Domain-Specific Lexicons**: Curated terminology across executive management, diplomacy, technology, and rhetoric.

### 5. 💍 Brain Vitals & Streak Fitness Rings
- **Apple Health-style Vitals Tracking**: Track daily minutes spoken, active vocabulary retention, and clarity benchmarks.
- **Streak Protection & Milestone Badges**: Motivational badges for 3-day, 7-day, 14-day, and 30-day speech streaks.

---

## 🎨 Visual Identity & Aesthetic

- **Ink Wash Minimalist Theme**: Soft Ivory (`#FAF8F5`, `#F5F2EB`), Cool Gray (`#E2DDD4`, `#52525B`), and Charcoal Black (`#18181B`) with warm Terracotta accents.
- **Editorial Typography**: Pairing *Newsreader* display serif with *Plus Jakarta Sans* for clean, high-contrast readability.
- **Light Surface Architecture**: Optimized for reading and deliberate, distraction-free practice.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide React.
- **Backend**: Node.js & Express API server with Vite middleware integration.
- **AI Engine**: Google Gen AI TypeScript SDK (`@google/genai`) powered by Gemini models (`gemini-3.7-flash` & `gemini-3.1-flash-lite`) with automated multi-tier fallback resilience.
- **Audio & Speech**: Web Speech Recognition API (Speech-to-Text) + Web Speech Synthesis API (Text-to-Speech).
- **Storage**: Safe client-side profile persistence with automatic migrations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- A Google Gemini API Key (`GEMINI_API_KEY`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd rise-os
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Starts the TypeScript full-stack development server on port 3000.
- `npm run build`: Compiles the Vite React client and bundles `server.ts` with `esbuild` for production.
- `npm run start`: Runs the compiled production server (`dist/server.cjs`).
- `npm run lint`: Validates TypeScript types across the codebase.

---

## 🔒 Security & Privacy

- All Gemini API calls are securely proxied through the Express backend (`/api/*`), ensuring API keys are never exposed to the client browser.
- Audio transcription occurs on-device or directly through browser speech APIs.
