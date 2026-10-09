import { create } from 'zustand';
import { QNode, Mission, ChatMessage, SideQuestLearningSummary } from '../types';
import {
  apiClient,
  MissionDto,
  ConversationDto,
  MessageDto,
  SideQuestLearningSummaryDto,
} from '../api/client';

interface CanvasState {
  mission: Mission;
  mainConversation: ConversationDto | null;
  nodes: QNode[];
  selectedNodeId: string | null;
  contextSnippet: string | null;
  isChatDrawerOpen: boolean;
  isRecoveryOpen: boolean;
  isRecoveryLoading: boolean;
  recoveryNodeId: string | null;
  currentSummary: SideQuestLearningSummaryDto | null;
  activeSidebarItem: 'canvas' | 'history' | 'export' | 'settings' | 'guide';
  isSidebarOpen: boolean;
  isMissionModalOpen: boolean;
  historyMissions: { id: string; title: string; createdAt: string; nodeCount: number }[];
  messagesByConversation: Record<string, ChatMessage[]>;
  isLoadingWorkspace: boolean;
  isAiGenerating: boolean;
  error: string | null;
  lastUnsentInput: string;

  // Actions
  initializeWorkspace: () => Promise<void>;
  loadMission: (missionId: string) => Promise<void>;
  selectNode: (id: string) => void;
  setContextSnippet: (snippet: string | null) => void;
  toggleChatDrawer: (open?: boolean) => void;
  openRecovery: (nodeId?: string) => Promise<void>;
  closeRecovery: () => void;
  openMissionModal: () => void;
  closeMissionModal: () => void;
  setActiveSidebarItem: (item: 'canvas' | 'history' | 'export' | 'settings' | 'guide') => void;
  toggleSidebar: () => void;
  updateMission: (mission: Partial<Mission>) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  clearError: () => void;

  // New Mission
  startNewChat: (title?: string, objective?: string) => Promise<void>;
  createMissionFromModal: (objective: string, title?: string) => Promise<void>;

  // Chat & Branch creation
  createBranchNode: (query: string, parentId?: string | null, snippet?: string) => Promise<string>;
  sendMessage: (conversationId: string, messageText: string) => Promise<void>;
  executeReturnToMission: (sideQuestConversationId: string) => Promise<void>;
}

const INITIAL_FALLBACK_MISSION: Mission = {
  id: 'mission-loading',
  title: 'Build a CRUD API',
  objective: 'Build a CRUD API using Go and PostgreSQL.',
  constraints: ['Use Go', 'Use PostgreSQL', 'Keep architecture simple'],
  completedSteps: ['Created project structure', 'Initialized server'],
  decisions: [],
  currentBlocker: '',
  nextAction: 'Implement database access',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'active',
};

const mapMessageDtoToChatMessage = (m: MessageDto): ChatMessage => ({
  id: m.id,
  role: m.role,
  content: m.content,
  createdAt: m.createdAt,
});

export const useCanvasStore = create<CanvasState>((set, get) => ({
  mission: INITIAL_FALLBACK_MISSION,
  mainConversation: null,
  nodes: [],
  selectedNodeId: null,
  contextSnippet: null,
  isChatDrawerOpen: false,
  isRecoveryOpen: false,
  isRecoveryLoading: false,
  recoveryNodeId: null,
  currentSummary: null,
  activeSidebarItem: 'canvas',
  isSidebarOpen: true,
  isMissionModalOpen: false,
  historyMissions: [],
  messagesByConversation: {},
  isLoadingWorkspace: true,
  isAiGenerating: false,
  error: null,
  lastUnsentInput: '',

  clearError: () => set({ error: null }),

  openMissionModal: () => set({ isMissionModalOpen: true }),
  closeMissionModal: () => set({ isMissionModalOpen: false }),

  selectNode: (id: string) => {
    set({ selectedNodeId: id });
  },

  setContextSnippet: (snippet: string | null) => {
    set({ contextSnippet: snippet });
  },

  toggleChatDrawer: (open?: boolean) => {
    set((state) => ({
      isChatDrawerOpen: open !== undefined ? open : !state.isChatDrawerOpen,
    }));
  },

  openRecovery: async (nodeId?: string) => {
    const { nodes, selectedNodeId, mainConversation } = get();
    const effectiveNodeId = nodeId || selectedNodeId || mainConversation?.id || 'root';
    const targetNode = nodes.find((n) => n.id === effectiveNodeId);

    set({
      isRecoveryOpen: true,
      recoveryNodeId: effectiveNodeId,
    });

    // If target is a SideQuest, auto-synthesize return to mission if no summary yet
    if (targetNode && targetNode.conversationType === 'sidequest') {
      await get().executeReturnToMission(effectiveNodeId);
    }
  },

  closeRecovery: () => {
    set({ isRecoveryOpen: false, isRecoveryLoading: false });
  },

  setActiveSidebarItem: (item) => {
    set({ activeSidebarItem: item });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  updateMission: (updated: Partial<Mission>) => {
    set((state) => ({
      mission: { ...state.mission, ...updated, updatedAt: new Date().toISOString() },
    }));
  },

  updateNodePosition: (id: string, position: { x: number; y: number }) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
    }));
  },

  deleteNode: (id: string) => {
    const { nodes, selectedNodeId, mainConversation } = get();
    if (id === 'root' || (mainConversation && id === mainConversation.id)) {
      return;
    }

    const toDelete = new Set<string>([id]);
    let added = true;
    while (added) {
      added = false;
      nodes.forEach((n) => {
        if (n.parentId && toDelete.has(n.parentId) && !toDelete.has(n.id)) {
          toDelete.add(n.id);
          added = true;
        }
      });
    }

    const nextNodes = nodes.filter((n) => !toDelete.has(n.id));
    set({
      nodes: nextNodes,
      selectedNodeId: toDelete.has(selectedNodeId || '') ? mainConversation?.id || 'root' : selectedNodeId,
    });
  },

  initializeWorkspace: async () => {
    set({ isLoadingWorkspace: true, error: null });
    try {
      const { missions } = await apiClient.listMissions();
      const historyList = missions.map((m) => ({
        id: m.id,
        title: m.objective.length > 32 ? m.objective.slice(0, 30) + '...' : m.objective,
        createdAt: new Date(m.createdAt).toLocaleDateString(),
        nodeCount: 1,
      }));

      set({ historyMissions: historyList });

      // Determine which mission to load
      const savedActiveMissionId = localStorage.getItem('threadback_active_mission_id');
      const targetMission =
        missions.find((m) => m.id === savedActiveMissionId) || missions[0];

      if (targetMission) {
        await get().loadMission(targetMission.id);
      } else {
        // No missions exist in DB yet, create initial seed mission
        const res = await apiClient.createMission('Build a CRUD API using Go and PostgreSQL.');
        await get().loadMission(res.mission.id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend';
      set({ error: msg, isLoadingWorkspace: false });
    }
  },

  loadMission: async (missionId: string) => {
    set({ isLoadingWorkspace: true, error: null });
    try {
      const { mission: missionDto, conversations } = await apiClient.getMission(missionId);
      localStorage.setItem('threadback_active_mission_id', missionId);

      const mainConv = conversations.find((c) => c.type === 'main') || null;
      const sideQuests = conversations.filter((c) => c.type === 'sidequest');

      // Fetch messages for each conversation in parallel
      const messagesMap: Record<string, ChatMessage[]> = {};
      await Promise.all(
        conversations.map(async (conv) => {
          try {
            const res = await apiClient.getConversationMessages(conv.id);
            messagesMap[conv.id] = res.messages.map(mapMessageDtoToChatMessage);
          } catch {
            messagesMap[conv.id] = [];
          }
        })
      );

      // Reconstruct ReactFlow Nodes
      const rootId = mainConv ? mainConv.id : 'root';
      const rootMessages = (mainConv && messagesMap[mainConv.id]) || [];
      const latestRootAssistant = [...rootMessages].reverse().find((m) => m.role === 'assistant');

      const rootNode: QNode = {
        id: rootId,
        parentId: null,
        query: missionDto.objective,
        answer:
          latestRootAssistant?.content ||
          `**Welcome to ThreadBack.**\n\nThis is your immutable **Original Context Root** for: "${missionDto.objective}".\n\n- Ask follow-up questions to interact with **Main AI**.\n- Spawn **SideQuests** to investigate topics without losing context.\n- Click **Return to Mission** on any SideQuest to synthesize key findings.`,
        status: 'done',
        position: { x: 80, y: 180 },
        createdAt: missionDto.createdAt,
        learningNotes: [],
        conversationType: 'main',
        messages: rootMessages,
      };

      const sideQuestNodes: QNode[] = sideQuests.map((sq, index) => {
        const sqMessages = messagesMap[sq.id] || [];
        const latestSqAssistant = [...sqMessages].reverse().find((m) => m.role === 'assistant');
        return {
          id: sq.id,
          parentId: rootId,
          query: sq.topic || 'Technical Exploration',
          answer:
            latestSqAssistant?.content ||
            'Explore this topic in isolation. Messages in this SideQuest are preserved independently.',
          status: 'done',
          position: { x: 500, y: 100 + index * 210 },
          createdAt: sq.createdAt,
          learningNotes: [],
          conversationType: 'sidequest',
          topic: sq.topic || undefined,
          messages: sqMessages,
        };
      });

      const allNodes = [rootNode, ...sideQuestNodes];

      const fullMission: Mission = {
        id: missionDto.id,
        title: missionDto.objective.length > 32 ? missionDto.objective.slice(0, 30) + '...' : missionDto.objective,
        objective: missionDto.objective,
        constraints: ['Maintain modular architecture', 'Preserve established constraints'],
        completedSteps: ['Initialized project space'],
        decisions: [],
        currentBlocker: '',
        nextAction: 'Ask your first inquiry to start your context branch',
        createdAt: missionDto.createdAt,
        updatedAt: missionDto.updatedAt,
        status: missionDto.status as 'active',
      };

      set({
        mission: fullMission,
        mainConversation: mainConv,
        nodes: allNodes,
        messagesByConversation: messagesMap,
        selectedNodeId: rootId,
        isLoadingWorkspace: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load mission';
      set({ error: msg, isLoadingWorkspace: false });
    }
  },

  startNewChat: async (title?: string, objective?: string) => {
    const promptText = objective || title || 'New Task Mission';
    await get().createMissionFromModal(promptText, title);
  },

  createMissionFromModal: async (objective: string, title?: string) => {
    set({ isLoadingWorkspace: true, error: null, isMissionModalOpen: false });
    try {
      const res = await apiClient.createMission(objective.trim());
      const { missions } = await apiClient.listMissions();

      set({
        historyMissions: missions.map((m) => ({
          id: m.id,
          title: m.objective.length > 32 ? m.objective.slice(0, 30) + '...' : m.objective,
          createdAt: new Date(m.createdAt).toLocaleDateString(),
          nodeCount: 1,
        })),
      });

      await get().loadMission(res.mission.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create mission';
      set({ error: msg, isLoadingWorkspace: false });
    }
  },

  createBranchNode: async (query: string, parentId?: string | null, snippet?: string) => {
    const { mission, mainConversation, nodes } = get();
    const effectiveParentId = parentId || mainConversation?.id || 'root';
    const parentNode = nodes.find((n) => n.id === effectiveParentId) || nodes[0];

    set({ isAiGenerating: true, error: null });

    try {
      // 1. Create SideQuest conversation in backend SQLite
      const { sideQuest } = await apiClient.createSideQuest(mission.id, query.trim());

      // Position calculation
      const siblings = nodes.filter((n) => n.parentId === parentNode?.id);
      const newX = (parentNode?.position?.x || 80) + 420;
      const newY = (parentNode?.position?.y || 180) + siblings.length * 210;

      const newSideQuestNode: QNode = {
        id: sideQuest.id,
        parentId: parentNode?.id || rootIdSafe(mainConversation),
        query,
        contextSnippet: snippet || undefined,
        answer: '',
        status: 'loading',
        position: { x: newX, y: Math.max(50, newY) },
        createdAt: sideQuest.createdAt,
        learningNotes: [],
        conversationType: 'sidequest',
        topic: query,
        messages: [{
          id: `tmp-${Date.now()}`,
          role: 'user',
          content: query,
          createdAt: new Date().toISOString(),
        }],
      };

      set((state) => ({
        nodes: [...state.nodes, newSideQuestNode],
        selectedNodeId: sideQuest.id,
        contextSnippet: null,
        isChatDrawerOpen: true,
        messagesByConversation: {
          ...state.messagesByConversation,
          [sideQuest.id]: newSideQuestNode.messages || [],
        },
      }));

      // 2. Call real SideQuest AI inference via backend
      const aiRes = await apiClient.sendSideQuestChat({
        conversationId: sideQuest.id,
        message: query,
        missionId: mission.id,
        sideQuestTopic: query,
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: aiRes.reply,
        createdAt: new Date().toISOString(),
      };

      set((state) => {
        const existingMessages = state.messagesByConversation[sideQuest.id] || [];
        const updatedMsgs = [...existingMessages, assistantMsg];
        return {
          isAiGenerating: false,
          nodes: state.nodes.map((n) =>
            n.id === sideQuest.id
              ? { ...n, answer: aiRes.reply, status: 'done', messages: updatedMsgs }
              : n
          ),
          messagesByConversation: {
            ...state.messagesByConversation,
            [sideQuest.id]: updatedMsgs,
          },
        };
      });

      return sideQuest.id;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create branch';
      set((state) => ({
        isAiGenerating: false,
        error: msg,
        lastUnsentInput: query,
        nodes: state.nodes.map((n) => (n.status === 'loading' ? { ...n, status: 'error' } : n)),
      }));
      throw err;
    }
  },

  sendMessage: async (conversationId: string, messageText: string) => {
    const text = messageText.trim();
    if (!text) return;

    const { nodes, mission, mainConversation, messagesByConversation } = get();
    const targetNode = nodes.find((n) => n.id === conversationId);
    const isMain =
      conversationId === 'root' ||
      (mainConversation && conversationId === mainConversation.id) ||
      targetNode?.conversationType === 'main';

    const actualConvId = isMain && mainConversation ? mainConversation.id : conversationId;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    // Optimistically append user message
    const prevMessages = messagesByConversation[actualConvId] || [];
    const optimisticMessages = [...prevMessages, userMessage];

    set((state) => ({
      isAiGenerating: true,
      error: null,
      messagesByConversation: {
        ...state.messagesByConversation,
        [actualConvId]: optimisticMessages,
      },
      nodes: state.nodes.map((n) =>
        n.id === conversationId || n.id === actualConvId
          ? { ...n, status: 'loading' }
          : n
      ),
    }));

    try {
      let reply = '';
      if (isMain) {
        // Send to Main AI
        const res = await apiClient.sendMainAiChat({
          conversationId: actualConvId,
          message: text,
          missionId: mission.id,
        });
        reply = res.reply;
      } else {
        // Send to SideQuest AI
        const res = await apiClient.sendSideQuestChat({
          conversationId: actualConvId,
          message: text,
          missionId: mission.id,
          sideQuestTopic: targetNode?.query,
        });
        reply = res.reply;
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };

      const finalMessages = [...optimisticMessages, assistantMessage];

      set((state) => ({
        isAiGenerating: false,
        lastUnsentInput: '',
        messagesByConversation: {
          ...state.messagesByConversation,
          [actualConvId]: finalMessages,
        },
        nodes: state.nodes.map((n) =>
          n.id === conversationId || n.id === actualConvId
            ? { ...n, answer: reply, status: 'done', messages: finalMessages }
            : n
        ),
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Message generation failed';
      set((state) => ({
        isAiGenerating: false,
        error: msg,
        lastUnsentInput: text,
        nodes: state.nodes.map((n) =>
          n.id === conversationId || n.id === actualConvId
            ? { ...n, status: 'error' }
            : n
        ),
      }));
    }
  },

  executeReturnToMission: async (sideQuestConversationId: string) => {
    const { nodes, mainConversation } = get();
    // Resolve to a valid sidequest conversation ID
    let targetId = sideQuestConversationId;
    if (targetId === 'root' || targetId === mainConversation?.id) {
      const firstSq = nodes.find((n) => n.conversationType === 'sidequest');
      if (firstSq) {
        targetId = firstSq.id;
      } else {
        return;
      }
    }

    set({ isRecoveryLoading: true, error: null });

    try {
      const res = await apiClient.returnToMission(targetId);
      const summary = res.summary;

      // Update node learning notes with structured summary
      set((state) => ({
        currentSummary: summary,
        isRecoveryLoading: false,
        nodes: state.nodes.map((n) =>
          n.id === targetId
            ? {
                ...n,
                learningNotes: summary.keyLearnings || [],
              }
            : n
        ),
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Return to Mission synthesis failed';
      set({ error: msg, isRecoveryLoading: false });
    }
  },
}));

function rootIdSafe(mainConv: ConversationDto | null): string {
  return mainConv?.id || 'root';
}
