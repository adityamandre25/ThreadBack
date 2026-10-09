export interface MissionDto {
  id: string;
  objective: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDto {
  id: string;
  missionId: string;
  type: 'main' | 'sidequest';
  topic: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface SideQuestLearningSummaryDto {
  topic: string;
  keyLearnings: string[];
  decisions: string[];
  usefulExamples: string[];
  unresolvedQuestions: string[];
  missionRelevance: string;
}

export interface ReturnToMissionResponseDto {
  summary: SideQuestLearningSummaryDto;
  missionId: string;
  mainConversationId: string;
  sideQuestConversationId: string;
}

export interface AiChatResponseDto {
  reply: string;
  conversationId: string;
  missionId?: string;
  sideQuestTopic?: string;
}

export interface AiStatusDto {
  configured: boolean;
  model: string;
}

export interface HealthDto {
  status: string;
  timestamp: string;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'http://localhost:4000/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `API request failed with status ${res.status}`;
      let errorData: unknown;
      try {
        const body = await res.json();
        errorData = body;
        if (body?.error) {
          errorMsg = typeof body.error === 'string' ? body.error : body.error.message || errorMsg;
        } else if (body?.message) {
          errorMsg = body.message;
        }
      } catch {
        // Response was not JSON
      }
      throw new ApiError(res.status, errorMsg, errorData);
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : 'Network request failed';
    throw new ApiError(0, `Cannot connect to backend (${url}): ${msg}`);
  }
}

export const apiClient = {
  getHealth: () => request<HealthDto>('health'),
  
  getAiStatus: () => request<AiStatusDto>('ai/status'),

  listMissions: () => request<{ missions: MissionDto[] }>('missions'),

  getMission: (id: string) =>
    request<{ mission: MissionDto; conversations: ConversationDto[] }>(`missions/${id}`),

  createMission: (objective: string) =>
    request<{ mission: MissionDto; mainConversation: ConversationDto }>('missions', {
      method: 'POST',
      body: JSON.stringify({ objective }),
    }),

  createSideQuest: (missionId: string, topic: string) =>
    request<{ sideQuest: ConversationDto }>(`missions/${missionId}/sidequests`, {
      method: 'POST',
      body: JSON.stringify({ topic }),
    }),

  getConversationMessages: (conversationId: string) =>
    request<{
      conversationId: string;
      type: 'main' | 'sidequest';
      topic: string | null;
      messages: MessageDto[];
    }>(`conversations/${conversationId}/messages`),

  sendMainAiChat: (payload: {
    conversationId: string;
    message: string;
    missionId?: string;
  }) =>
    request<AiChatResponseDto>('ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sendSideQuestChat: (payload: {
    conversationId: string;
    message: string;
    missionId?: string;
    sideQuestTopic?: string;
  }) =>
    request<AiChatResponseDto>('ai/sidequest/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  returnToMission: (sideQuestConversationId: string) =>
    request<ReturnToMissionResponseDto>(
      `conversations/${sideQuestConversationId}/return-to-mission`,
      {
        method: 'POST',
      }
    ),
};
