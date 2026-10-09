export type MissionStatus = 'active' | 'completed' | 'archived';
export type ConversationType = 'main' | 'sidequest';
export type MessageRole = 'user' | 'assistant';

export interface Mission {
  id: string;
  objective: string;
  status: MissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  missionId: string;
  type: ConversationType;
  topic: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface MissionMemory {
  id: string;
  missionId: string;
  summary: string;
  progress: string;
  decisions: string[];
  blockers: string[];
  nextStep: string;
  updatedAt: string;
}

export interface SideQuestLearningSummary {
  topic: string;
  keyLearnings: string[];
  decisions: string[];
  usefulExamples: string[];
  unresolvedQuestions: string[];
  missionRelevance: string;
}

export interface SideQuestMemory {
  id: string;
  conversationId: string;
  learningSummary: string;
  unresolvedQuestions: string[];
  isIncorporated?: boolean;
  updatedAt: string;
}

export interface CreateMissionResult {
  mission: Mission;
  mainConversation: Conversation;
}

export interface MissionWithConversations {
  mission: Mission;
  conversations: Conversation[];
}
