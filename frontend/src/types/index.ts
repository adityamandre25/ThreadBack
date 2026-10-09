export type QNode = {
  id: string;
  parentId: string | null;
  query: string;
  contextSnippet?: string; // text selected in the parent's answer that spawned this node
  answer: string;          // markdown response
  status: 'idle' | 'loading' | 'done' | 'error';
  position: { x: number; y: number };
  createdAt?: string;
  learningNotes?: string[];
  conversationType?: 'main' | 'sidequest';
  topic?: string;
  messages?: ChatMessage[];
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  useful?: boolean;
}

export interface QueryBranch {
  id: string;
  missionId: string;
  parentBranchId: string | null;
  title: string;
  question: string;
  messages: ChatMessage[];
  learningNotes: string[];
  expanded: boolean;
  createdAt: string;
  tags?: string[];
  position?: { x: number; y: number };
}

export interface SideQuestLearningSummary {
  topic: string;
  keyLearnings: string[];
  decisions: string[];
  usefulExamples: string[];
  unresolvedQuestions: string[];
  missionRelevance: string;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  constraints: string[];
  completedSteps: string[];
  decisions: string[];
  currentBlocker: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'in_progress' | 'completed';
}

export type ActiveTab = 'landing' | 'workspace';
