import Database from 'better-sqlite3';

export const SCHEMA_SQL = `
-- 1. Missions table
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  objective TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Conversations table (one main conversation, zero or more sidequests per mission)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('main', 'sidequest')),
  topic TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Partial unique index ensuring exactly one 'main' conversation per mission
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_main_conversation 
  ON conversations(mission_id) WHERE type = 'main';

CREATE INDEX IF NOT EXISTS idx_conversations_mission_id 
  ON conversations(mission_id);

-- 3. Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at 
  ON messages(conversation_id, created_at ASC);

-- 4. Mission Memories table (at most one memory record per mission)
CREATE TABLE IF NOT EXISTS mission_memories (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL UNIQUE REFERENCES missions(id) ON DELETE CASCADE,
  summary TEXT NOT NULL DEFAULT '',
  progress TEXT NOT NULL DEFAULT '',
  decisions TEXT NOT NULL DEFAULT '[]',
  blockers TEXT NOT NULL DEFAULT '[]',
  next_step TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_memories_mission_id 
  ON mission_memories(mission_id);

-- 5. SideQuest Memories table (at most one memory record per sidequest conversation)
CREATE TABLE IF NOT EXISTS sidequest_memories (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL UNIQUE REFERENCES conversations(id) ON DELETE CASCADE,
  learning_summary TEXT NOT NULL DEFAULT '',
  unresolved_questions TEXT NOT NULL DEFAULT '[]',
  is_incorporated INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sidequest_memories_conversation_id 
  ON sidequest_memories(conversation_id);
`;

/**
 * Initializes database schema idempotently.
 */
export function initializeSchema(db: Database.Database): void {
  db.exec(SCHEMA_SQL);

  // Non-destructive idempotent column migration for existing databases
  try {
    const columns = db.pragma('table_info(sidequest_memories)') as { name: string }[];
    if (Array.isArray(columns) && !columns.some((c) => c.name === 'is_incorporated')) {
      db.exec('ALTER TABLE sidequest_memories ADD COLUMN is_incorporated INTEGER NOT NULL DEFAULT 0');
    }
  } catch {
    // Ignore migration errors if pragma unavailable or already applied
  }
}
