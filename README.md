# ThreadBack

### Stay focused on the mission. Explore anything. Bring back only what matters.

ThreadBack is an AI-powered workspace that helps individuals and teams work on complex objectives without losing important context.

It separates a primary **Mission** from focused side conversations called **SideQuests**. Users can explore unfamiliar concepts, compare technologies, brainstorm alternatives, or investigate unrelated topics without cluttering the main conversation.

Instead of transferring entire conversation histories, ThreadBack preserves the information that matters: **decisions, reasoning, key learnings, progress, blockers, and next steps.**

---

## The Problem

AI conversations tend to drift as tasks become more complex.

While building a product, a developer might need to understand a new concept, compare frameworks, investigate an implementation detail, or explore an alternative approach. These explorations are useful, but they can bury important decisions and distract the AI from the original objective.

In collaborative settings, the problem becomes even harder. Different people have different ideas, preferences, and reasoning. Combining every conversation into one context creates noise rather than intelligence.

**ThreadBack separates conversation history from meaningful context.**

- **Conversation history:** Everything that was said.
- **Mission context:** What matters for completing the objective.
- **Personal context:** Individual preferences, reasoning, and perspectives.
- **Shared decisions:** Relevant information that can be transferred to a central AI.

The goal is simple: preserve useful context without carrying unnecessary conversation history everywhere.

---

## Two Core Use Cases

### 1. Multi-Agent Collaboration — One Personal AI for Every Person

Imagine a team working together on a product. Every person has a personal AI agent that helps them reason, explore ideas, evaluate alternatives, and develop recommendations.

Each agent works with its own conversational context. When a decision or finding becomes relevant to the shared objective, the appropriate information can be passed to the **Main AI**.

The Main AI combines contributions, evaluates trade-offs, tracks disagreements, and helps the team reach a coherent outcome.

**Example: Choosing a technology stack**

- **Person A's AI:** Recommends React because the team already knows it.
- **Person B's AI:** Recommends Next.js because server-side rendering is required.
- **Person C's AI:** Raises concerns about implementation time and project complexity.
- **Main AI:** Evaluates the recommendations against shared requirements, records the decision and rationale, and identifies unresolved disagreements.

The Main AI should not blindly merge every person's conversation. It should understand **who proposed what, why it was proposed, whether it was accepted, and what remains unresolved.**

Personal conversations should remain private unless their relevant information is explicitly authorized for sharing.

**The outcome:** Multiple personal AI agents contribute useful intelligence to one shared decision-making system.

### 2. Mission-Focused Work — Keep the Main AI on Track

Suppose your mission is:

**Build a CRUD API with authentication.**

You begin working with the Main AI on requirements, architecture, and implementation. During development, you encounter unfamiliar concepts or need to compare different approaches.

Instead of derailing the main conversation, you open a SideQuest.

**Example workflow:**

1. **Create a Mission:** Build a CRUD API with authentication.
2. **Work with the Main AI:** Define requirements, choose the architecture, and plan implementation.
3. **Explore in a SideQuest:** Investigate JWT middleware, compare libraries, or explore a different frontend framework.
4. **Extract what matters:** Capture useful findings, technical decisions, rationale, examples, and unresolved questions.
5. **Return to the Mission:** Transfer the relevant summary to the Main AI.
6. **Continue seamlessly:** The Main AI resumes work with the useful context without importing the entire SideQuest transcript.

The same principle applies to tangential discussions. An unrelated conversation should not automatically become part of the mission's memory.

**The outcome:** The AI retains the context required to complete the objective without being overwhelmed by everything discussed along the way.

---

## Core Principles

| Principle | What it means |
|---|---|
| Mission-first | Keep the primary objective and progress central. |
| Context over transcripts | Preserve important conclusions instead of copying every message. |
| Isolated exploration | Investigate subtopics without derailing the main conversation. |
| Selective transfer | Pass only relevant findings and decisions to the shared context. |
| Traceable decisions | Preserve decision rationale, authorship, and status. |
| Bounded context | Avoid repeatedly injecting redundant summaries into AI prompts. |
| Privacy-aware sharing | Keep personal information separate unless sharing is authorized. |

---

## How ThreadBack Works

```text
                         THREADBACK
                              |
              +---------------+---------------+
              |                               |
        PERSONAL AGENTS                 MISSION WORKSPACE
              |                               |
       +------+------+                 +------+------+
       |      |      |                 |             |
     AI A    AI B   AI C            Main AI      SideQuests
       |      |      |                 |             |
       +------+------+                 |       Explore topics
              |                         |       Compare options
       Relevant decisions               |       Learn concepts
       and supporting context           |             |
              |                         |      Structured summary
              v                         |             |
       +----------------+               +-------------+
       |    Main AI     |<----------------------------+
       |                |
       | Shared context |
       | Decisions      |
       | Trade-offs     |
       | Final outcome  |
       +----------------+
```

The multi-agent collaboration flow represents the broader product direction. The existing application implements the Mission, Main AI, SideQuest, and selective context-transfer workflow; complete multi-user agent coordination may require additional implementation.

### Current Context-Transfer Flow

```text
User explores a topic in a SideQuest
                 |
                 v
       Return to Mission
                 |
                 v
    Generate structured summary
                 |
                 v
      Store SideQuest memory
                 |
                 v
       Update mission memory
                 |
                 v
      Main AI receives relevant
        context on a later turn
                 |
                 v
       Continue the mission
```

The SideQuest's raw transcript remains separate from the Main AI's message history. Relevant summaries and mission memory can be supplied to the Main AI when needed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Frontend state | Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite with `better-sqlite3` |
| AI integration | Google GenAI SDK |
| Testing | Vitest |

---

## Current Features

- Persistent Main AI conversations.
- Persistent SideQuest conversations.
- Mission creation and retrieval.
- Multiple SideQuests linked to a mission.
- Structured summaries when returning from SideQuests.
- Mission memory for summaries, progress, decisions, blockers, and next steps.
- SQLite persistence for missions, conversations, messages, and memory.
- Sliding context windows for AI prompts while retaining full conversation history.
- Separation of Main AI and SideQuest histories and system prompts.
- Deduplication and bounded injection of completed SideQuest summaries.
- API validation, health checks, configuration status, and failure handling.
- Automated backend tests using Vitest.

---

## Repository Structure

```text
ThreadBack/
├── frontend/
│   ├── src/
│   │   ├── api/            # Typed backend API client
│   │   ├── components/     # UI components
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript types and schemas
│   │   └── App.tsx         # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/                # Routes, controllers, services, repositories
│   ├── data/               # Local SQLite database
│   ├── tests/              # Vitest test suites
│   └── package.json
│
├── package.json            # Root scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Google GenAI API key with access to the configured model

### 1. Clone the repository

```bash
git clone https://github.com/adityamandre25/ThreadBack.git
cd ThreadBack
```

### 2. Install dependencies

```bash
npm install
```

If dependencies are managed separately, install them in the `frontend` and `backend` directories as required by the package manifests.

### 3. Configure environment variables

Configure the backend environment in the location expected by the application, such as `backend/.env` or the root `.env`.

```env
PORT=4000
GEMINI_API_KEY=your_actual_api_key
GEMMA_MODEL=gemma-4-26b-a4b-it
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

**Important:** Never commit real API keys. Keep provider credentials on the backend. Variables prefixed with `VITE_` are exposed to the browser.

### 4. Start the backend

From the repository root:

```bash
npm run dev:backend
```

The backend is configured to use port `4000` by default.

### 5. Start the frontend

Open another terminal:

```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

Use the scripts defined in the repository's `package.json` files if your local setup differs.

---

## Build and Validation

Run the following commands from the repository root:

```bash
# Build the application
npm run build

# Type-check the frontend and backend
npm run typecheck

# Run automated tests
npm test
```

The existing project documentation reports 96 backend tests across 10 test files. Run the test suite in your checkout to confirm the current result.

An additional verification script is documented:

```bash
npx tsx scripts/verify-phase4.ts
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/missions` | Create a mission and its Main conversation. |
| `GET` | `/api/missions` | List recent missions. |
| `GET` | `/api/missions/:id` | Retrieve a mission and its conversations. |
| `POST` | `/api/missions/:id/sidequests` | Create a SideQuest for a mission. |
| `GET` | `/api/conversations/:id/messages` | Retrieve chronological messages. |
| `POST` | `/api/ai/chat` | Continue the Main AI conversation. |
| `POST` | `/api/ai/sidequest/chat` | Continue a SideQuest conversation. |
| `POST` | `/api/conversations/:id/return-to-mission` | Summarize a SideQuest and prepare context transfer. |
| `GET` | `/api/health` | Check backend health. |
| `GET` | `/api/ai/status` | Check AI configuration status. |

### Main AI Chat Example

```json
{
  "conversationId": "your-main-conversation-id",
  "message": "Use the authentication approach we agreed on and continue with the protected routes."
}
```

### SideQuest Chat Example

```json
{
  "conversationId": "your-sidequest-conversation-id",
  "message": "Explain JWT middleware and compare the implementation options."
}
```

### Return to Mission

```http
POST /api/conversations/:id/return-to-mission
```

This endpoint synthesizes the SideQuest into a structured summary and prepares relevant information for the mission. Refer to the current route implementation for the exact response schema.

---

## Database Design

ThreadBack uses SQLite through `better-sqlite3` for local persistence.

| Table | Purpose |
|---|---|
| `missions` | Mission objectives, status, and timestamps. |
| `conversations` | Main and SideQuest conversation metadata. |
| `messages` | Raw conversation messages. |
| `mission_memories` | Mission summary, progress, decisions, blockers, and next step. |
| `sidequest_memories` | Structured SideQuest summaries, unresolved questions, and incorporation status. |

A mission has one Main conversation and can have multiple SideQuest conversations. Memory is stored separately from raw message history so useful information can be retrieved without merging transcripts.

The database is created locally at runtime. Do not commit local database files or secrets.

---

## Roadmap

The broader vision is to evolve ThreadBack into a reliable context and decision layer for personal AI agents and collaborative work.

- [ ] Personal AI agents for individual participants.
- [ ] Shared decision layer for transferring relevant, authorized context.
- [ ] Decision provenance: record who proposed each decision and why.
- [ ] Decision status: distinguish proposals, accepted decisions, and rejected alternatives.
- [ ] Conflict resolution that surfaces disagreements instead of silently discarding them.
- [ ] Mission relevance filtering to keep unrelated discussions out of mission memory.
- [ ] Permission-aware sharing between personal agents and the Main AI.
- [ ] Evolving mission memory that tracks progress, blockers, and next steps.

These are roadmap goals, not claims that all multi-agent capabilities are already implemented.

---

## Contributing

Contributions are welcome.

1. Keep Main AI and SideQuest histories isolated unless deliberately changing context-transfer behavior.
2. Preserve the distinction between raw messages and structured mission memory.
3. Add tests for context transfer, deduplication, validation, and failure cases.
4. Run type checking and automated tests before submitting changes.
5. Never commit API keys, local databases, or other secrets.

## License

ThreadBack is licensed under the [MIT License](LICENSE).
