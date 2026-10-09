ThreadBack
Stay focused on the mission. Explore anything. Bring back only what
matters.
ThreadBack is an AI-powered workspace designed to help people make
progress on complex tasks without losing the context that matters. It
separates a primary Mission from focused side conversations called
SideQuests. Users can explore ideas, ask questions, compare
approaches, or discuss tangential topics without flooding the main
conversation with every message.
Instead of merging entire conversations, ThreadBack extracts useful
context---such as decisions, rationale, learnings, blockers, and next
steps---and makes that information available to the Main AI.
The problem
Long AI conversations often drift. While working toward a goal, a user
may need to investigate an unfamiliar concept, compare technologies,
brainstorm an alternative, or briefly discuss something unrelated.
Keeping all of that in one conversation can bury important decisions and
make it harder for the AI to stay focused.
ThreadBack treats conversation history and mission context as
different things:
- Conversation history preserves what was said.
- Mission context preserves what matters for completing the goal.
- Side conversations can remain separate while their relevant
  conclusions flow back to the mission.
Two core use cases
1. Personal AI agents working toward a shared outcome
Each participant can work with a personal AI agent that understands
their own perspective, preferences, and reasoning. These agents can
explore options independently and develop recommendations. Only
relevant, shareable decisions and supporting context need to flow to the
Main AI, which combines contributions and helps the group reach a
coherent outcome.
Example: A team is planning a product. One person's agent recommends
React based on the team's experience; another recommends Next.js for the
product's rendering needs; a third flags the implementation deadline.
The Main AI compares the proposals against the shared requirements,
surfaces trade-offs, records the decisions, and identifies unresolved
disagreements.
Design principle: The Main AI should not blindly concatenate
everyone's conversations. It should preserve who proposed what, why they
proposed it, whether it was accepted, and what remains unresolved.
Private personal context should not be shared automatically.
This is a core product direction. The current repository documents
Main AI and SideQuest conversations for a mission; a complete
multi-user personal-agent coordination workflow may require additional
implementation.

2. Mission-focused work with isolated exploration
A user creates a mission such as "Build a CRUD API." The Main AI
helps plan and execute the objective. During the work, the user can open
SideQuests to investigate a topic, compare approaches, or explore a
branch of work.
Example workflow:
1. Create a mission: "Build a CRUD API with authentication."
2. Work with the Main AI: Define requirements, architecture, and
   milestones.
3. Explore in a SideQuest: Ask how JWT middleware works, compare
   libraries, or investigate an implementation detail.
4. Return to the mission: Generate a concise summary containing the
   useful findings, decisions, examples, and unresolved questions.
5. Continue with relevant context: The Main AI receives the summary
   without importing the SideQuest's raw transcript into its own
   message history.
The same principle applies when a user discusses something unrelated in
a separate conversation: it should not become mission context unless it
is deliberately judged relevant.
Core principles
- Mission-first: Keep the primary objective, progress, blockers,
  and next steps easy to recover.
- Focused exploration: Investigate subtopics in separate
  conversations without derailing the main thread.
- Selective context transfer: Transfer decisions and useful
  findings, not every message.
- History isolation: Preserve each conversation's transcript
  independently.
- Traceable decisions: Keep the rationale and status of decisions
  so the Main AI can distinguish proposals from accepted choices.
- Bounded context: Inject a limited amount of relevant information
  into prompts to reduce repetition and context bloat.
- Privacy by design: In a multi-person workflow, share only
  information that is appropriate and authorized to share.
How it works today
The current application uses a React frontend and an Express/TypeScript
backend. Missions, conversations, messages, and structured memory are
persisted in SQLite. The backend calls Google's GenAI SDK for model
inference.
At a high level:
Mission
  |
  +-- Main conversation
  |     +-- Mission objective
  |     +-- Progress, decisions, blockers, next step
  |
  +-- SideQuest conversation(s)
        +-- Separate message history
        +-- Focused exploration
        +-- Structured learning summary
                    |
                    v
          Mission memory / Main AI context
Context-transfer flow
1. The user explores a topic in a SideQuest.
2. The user invokes Return to Mission.
3. The backend synthesizes a structured learning summary.
4. The summary is stored as SideQuest memory, and relevant decisions
   are merged into mission memory.
5. On a subsequent Main AI turn, relevant summaries and mission memory
   can be included in the prompt.
6. The original SideQuest transcript remains separate from the Main
   conversation history.
The backend limits injected completed SideQuest summaries and tracks
incorporation to avoid repeatedly adding the same summary to the prompt.
Current features
- Persistent Main AI and SideQuest conversations.
- Mission creation and retrieval.
- SideQuests linked to a mission.
- Structured summaries for returning from a SideQuest to a mission.
- Mission memory for summary, progress, decisions, blockers, and next
  step.
- SQLite persistence using better-sqlite3.
- A sliding recent-message window for model prompts while retaining
  full history in the database.
- Separate Main AI and SideQuest message histories and system prompts.
- Request validation, health/status endpoints, and failure handling.
- Automated backend tests using Vitest.
Tech stack
  Layer            Technology
  Frontend         React, TypeScript, Vite, Tailwind CSS
  Frontend state   Zustand
  Backend          Node.js, Express, TypeScript
  Database         SQLite with better-sqlite3
  AI integration   Google GenAI SDK
  Testing          Vitest
Repository structure
ThreadBack/
├── frontend/
│   ├── src/
│   │   ├── api/           # Typed backend REST API client
│   │   ├── components/    # UI components
│   │   ├── store/         # Zustand state and synchronization
│   │   ├── types/         # TypeScript contracts and schemas
│   │   └── App.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/               # Routes, controllers, services, repositories
│   ├── data/              # Local SQLite database (created at runtime)
│   ├── tests/             # Vitest suites
│   └── package.json
├── package.json           # Root scripts and workspace commands
└── README.md
Getting started
Prerequisites
- Node.js 18 or later
- npm 9 or later
- A Google GenAI API key with access to the configured model
1. Install dependencies
From the repository root:
npm install
If the repository uses separate package manifests and dependencies are
not installed by the root command, install them in the relevant
frontend/ and backend/ directories as needed.
2. Configure environment variables
Configure the backend environment in the location expected by the
backend configuration (for example, backend/.env or the root .env,
depending on the current setup):
PORT=4000
GEMINI_API_KEY=your_actual_api_key
GEMMA_MODEL=gemma-4-26b-a4b-it
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
Configure the frontend in frontend/.env:
VITE_API_URL=http://localhost:4000/api
Do not commit real API keys. Keep provider credentials on the backend;
variables prefixed with VITE_ are exposed to the browser.
3. Run the application
Start the backend API:
npm run dev:backend
Start the frontend in another terminal:
npm run dev:frontend
Open http://localhost:5173.
If the root scripts differ in your checkout, use the scripts defined in
the root and package-level package.json files.
4. Build and validate
npm run build
npm run typecheck
npm test
The existing project documentation reports 96 backend tests across 10
test files. Run the test command in your checkout to verify the current
result.
A Phase 4 verification script is also documented:
npx tsx scripts/verify-phase4.ts
API overview
The following endpoints are documented by the current backend:
  Method                  Endpoint                                     Purpose
  POST                  /api/missions                              Create a mission and
                                                                       its Main conversation
  GET                   /api/missions                              List recent missions
  GET                   /api/missions/:id                          Retrieve a mission and
                                                                       its conversations
  POST                  /api/missions/:id/sidequests               Create a SideQuest
                                                                       linked to a mission
  GET                   /api/conversations/:id/messages            Retrieve chronological
                                                                       conversation messages
  POST                  /api/ai/chat                               Continue the Main AI
                                                                       conversation
  POST                  /api/ai/sidequest/chat                     Continue a SideQuest
                                                                       conversation
  POST                  /api/conversations/:id/return-to-mission   Summarize a SideQuest
                                                                       and prepare relevant
                                                                       context for the mission
  GET                   /api/health                                Check backend health
  GET                   /api/ai/status                             Inspect AI
                                                                   configuration status
Example: Continue the Main AI conversation
{
  "conversationId": "your-main-conversation-id",
  "message": "Use the authentication approach we agreed on and continue with the protected routes."
}
Example: Continue a SideQuest
{
  "conversationId": "your-sidequest-conversation-id",
  "message": "Explain how JWT middleware works and compare the implementation options."
}
Example: Return to the mission
POST /api/conversations/:id/return-to-mission
The backend creates a structured summary of the SideQuest and makes
relevant findings available to the mission. Refer to the route
implementation and tests for the exact response schema.
Data model
The documented SQLite schema contains these core entities:
- missions --- objective, status, and timestamps.
- conversations --- conversation ID, associated mission, type
  (main or sidequest), topic, and timestamps.
- messages --- raw messages associated with a conversation.
- mission_memories --- mission summary, progress, decisions,
  blockers, and next step.
- sidequest_memories --- structured SideQuest learning summary,
  unresolved questions, and incorporation status.
A mission has one Main conversation and can have multiple SideQuest
conversations. Memory is stored separately from raw message history so
that useful context can be retrieved without merging transcripts.
Roadmap direction
The product direction is to expand selective context transfer into a
robust mission and multi-agent context system:
- Personal agents: Give each participant an agent that can reason
  about their own perspective.
- Shared decision layer: Send selected decisions and supporting
  evidence to the Main AI.
- Decision provenance: Track the author, rationale, status, and
  timestamp of each proposal or decision.
- Conflict handling: Surface disagreements and unresolved
  questions instead of silently choosing a winner.
- Mission relevance filtering: Keep unrelated conversation content
  out of mission memory.
- Permission-aware sharing: Let participants control which
  personal context can be shared with the group.
- Mission memory maintenance: Update decisions, progress,
  blockers, and next steps as the project evolves.
These are product goals, not a claim that every capability is already
implemented.
Contributing
Contributions are welcome. Before submitting a change:
1. Keep Main and SideQuest histories isolated unless a deliberate
   context-transfer operation is being changed.
2. Preserve the distinction between raw conversation messages and
   structured mission memory.
3. Add or update tests for context transfer, deduplication, validation,
   and failure cases.
4. Run type checking and tests.
5. Never commit API keys, local databases, or other secrets.