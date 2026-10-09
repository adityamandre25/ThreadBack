import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import { getDatabase } from '../database';
import {
  Mission,
  Conversation,
  CreateMissionResult,
  MissionWithConversations,
  MissionStatus,
} from '../../types/db.types';

interface MissionRow {
  id: string;
  objective: string;
  status: MissionStatus;
  created_at: string;
  updated_at: string;
}

interface ConversationRow {
  id: string;
  mission_id: string;
  type: 'main' | 'sidequest';
  topic: string | null;
  created_at: string;
  updated_at: string;
}

function mapMissionRow(row: MissionRow): Mission {
  return {
    id: row.id,
    objective: row.objective,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapConversationRow(row: ConversationRow): Conversation {
  return {
    id: row.id,
    missionId: row.mission_id,
    type: row.type,
    topic: row.topic,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class MissionRepository {
  constructor(private readonly getDb: () => Database.Database = getDatabase) {}

  /**
   * Creates a new mission and its associated 'main' conversation within an atomic transaction.
   */
  createMissionWithMainConversation(objective: string): CreateMissionResult {
    const db = this.getDb();
    const missionId = randomUUID();
    const conversationId = randomUUID();
    const now = new Date().toISOString();

    const insertMission = db.prepare<[string, string, string, string]>(`
      INSERT INTO missions (id, objective, status, created_at, updated_at)
      VALUES (?, ?, 'active', ?, ?)
    `);

    const insertConversation = db.prepare<[string, string, string, string]>(`
      INSERT INTO conversations (id, mission_id, type, topic, created_at, updated_at)
      VALUES (?, ?, 'main', NULL, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertMission.run(missionId, objective.trim(), now, now);
      insertConversation.run(conversationId, missionId, now, now);
    });

    transaction();

    return {
      mission: {
        id: missionId,
        objective: objective.trim(),
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      mainConversation: {
        id: conversationId,
        missionId,
        type: 'main',
        topic: null,
        createdAt: now,
        updatedAt: now,
      },
    };
  }

  /**
   * Retrieves a mission by its ID.
   */
  getMissionById(id: string): Mission | null {
    const db = this.getDb();
    const row = db
      .prepare<[string], MissionRow>('SELECT * FROM missions WHERE id = ?')
      .get(id);

    return row ? mapMissionRow(row) : null;
  }

  /**
   * Retrieves a mission together with all its associated conversations (main and sidequests).
   */
  getMissionWithConversations(id: string): MissionWithConversations | null {
    const db = this.getDb();
    const missionRow = db
      .prepare<[string], MissionRow>('SELECT * FROM missions WHERE id = ?')
      .get(id);

    if (!missionRow) return null;

    const conversationRows = db
      .prepare<[string], ConversationRow>(
        'SELECT * FROM conversations WHERE mission_id = ? ORDER BY created_at ASC'
      )
      .all(id);

    return {
      mission: mapMissionRow(missionRow),
      conversations: conversationRows.map(mapConversationRow),
    };
  }

  /**
   * Lists recent missions.
   */
  listMissions(limit = 50): Mission[] {
    const db = this.getDb();
    const rows = db
      .prepare<[number], MissionRow>('SELECT * FROM missions ORDER BY created_at DESC LIMIT ?')
      .all(limit);

    return rows.map(mapMissionRow);
  }

  /**
   * Updates mission status and updated_at timestamp.
   */
  updateMissionStatus(id: string, status: MissionStatus): boolean {
    const db = this.getDb();
    const now = new Date().toISOString();
    const result = db
      .prepare<[string, string, string]>('UPDATE missions SET status = ?, updated_at = ? WHERE id = ?')
      .run(status, now, id);

    return result.changes > 0;
  }
}

export const missionRepository = new MissionRepository();
