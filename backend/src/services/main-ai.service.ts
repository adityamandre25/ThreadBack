import { env } from '../config/env';
import { executeGemmaGeneration, GenerateGemmaParams } from '../lib/gemma-client';
import { buildMainAiSystemPrompt } from '../prompts/main-ai.prompt';
import { ChatRequest, ChatResponse, GemmaContentMessage } from '../types/ai.types';
import {
  conversationRepository,
  missionRepository,
  messageRepository,
  memoryRepository,
} from '../db';
import { ApiError } from '../utils/api-error';

export class MainAiService {
  private readonly generateFn: (params: GenerateGemmaParams) => Promise<string>;
  private readonly model?: string;

  constructor(
    generateFn: (params: GenerateGemmaParams) => Promise<string> = executeGemmaGeneration,
    model?: string
  ) {
    this.generateFn = generateFn;
    this.model = model;
  }

  /**
   * Orchestrates the Main AI chat interaction.
   * Supports both persisted conversations (via conversationId) and stateless mode.
   */
  async processChat(request: ChatRequest): Promise<ChatResponse> {
    const activeModel = this.model || env.gemmaModel;

    // --- Persisted Conversation Mode ---
    if (request.conversationId) {
      const conversation = conversationRepository.getConversationById(request.conversationId);
      if (!conversation) {
        throw ApiError.notFound(`Conversation with ID ${request.conversationId} not found.`);
      }
      if (conversation.type !== 'main') {
        throw ApiError.badRequest(`Conversation ${request.conversationId} is a SideQuest, not a Main conversation.`);
      }

      if (request.missionId && request.missionId !== conversation.missionId) {
        throw ApiError.badRequest(`Mission ID mismatch for conversation ${request.conversationId}.`);
      }

      const mission = missionRepository.getMissionById(conversation.missionId);
      if (!mission) {
        throw ApiError.notFound(`Mission with ID ${conversation.missionId} not found.`);
      }

      // Determine incoming user message content
      let userMessageText = '';
      if (request.message && request.message.trim().length > 0) {
        userMessageText = request.message.trim();
      } else if (request.messages && request.messages.length > 0) {
        const lastMsg = request.messages[request.messages.length - 1];
        if (lastMsg) {
          userMessageText = lastMsg.content.trim();
        }
      }

      if (!userMessageText) {
        throw ApiError.badRequest('A non-empty user message is required.');
      }

      // Load authoritative history from SQLite (recent context window)
      const storedMessages = messageRepository.getRecentContextMessages(conversation.id, 30);
      const formattedHistory: GemmaContentMessage[] = storedMessages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Append incoming user message
      const formattedContents: GemmaContentMessage[] = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessageText }] },
      ];

      // Save user message to SQLite
      const userMessage = messageRepository.createMessage(conversation.id, 'user', userMessageText);
      conversationRepository.touchConversation(conversation.id);

      // Load mission memory and bounded recent unincorporated SideQuest summaries
      const missionMemory = memoryRepository.getMissionMemory(mission.id);
      const unincorporatedSideQuests = memoryRepository.getUnincorporatedSideQuestSummaries(mission.id, 2);
      const sideQuestSummaries = unincorporatedSideQuests.map((u) => u.summary);

      // Build system instruction with structured context
      const systemInstruction = buildMainAiSystemPrompt(mission.objective, {
        missionMemory,
        sideQuestSummaries,
      });

      // Invoke shared Gemma model with rollback guard
      let reply: string;
      try {
        reply = await this.generateFn({
          model: activeModel,
          systemInstruction,
          contents: formattedContents,
        });
      } catch (error) {
        // Rollback user message so failed turn doesn't leave orphaned state in history
        messageRepository.deleteMessage(userMessage.id);
        throw error;
      }

      // On successful inference, persist the assistant response
      messageRepository.createMessage(conversation.id, 'assistant', reply);
      conversationRepository.touchConversation(conversation.id);

      // Mark the consumed SideQuest summaries as incorporated into mission context
      if (unincorporatedSideQuests.length > 0) {
        memoryRepository.markSideQuestSummariesIncorporated(
          unincorporatedSideQuests.map((u) => u.conversationId)
        );
      }

      return {
        reply,
        conversationId: conversation.id,
        missionId: mission.id,
      };
    }

    // --- Stateless Mode (Backward Compatible) ---
    const missionObjective = request.missionObjective!;
    const messages = request.messages!;

    const systemInstruction = buildMainAiSystemPrompt(missionObjective);
    const formattedContents: GemmaContentMessage[] = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const reply = await this.generateFn({
      model: activeModel,
      systemInstruction,
      contents: formattedContents,
    });

    return {
      reply,
    };
  }
}

export const mainAiService = new MainAiService();
