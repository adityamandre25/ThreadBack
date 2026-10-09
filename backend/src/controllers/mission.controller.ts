import { Request, Response, NextFunction } from 'express';
import {
  createMissionSchema,
  createSideQuestSchema,
  idParamSchema,
} from '../schemas/mission.schema';
import {
  missionRepository,
  conversationRepository,
  messageRepository,
} from '../db';
import { returnToMissionService } from '../services/return-to-mission.service';
import { ApiError } from '../utils/api-error';

export class MissionController {
  /**
   * POST /api/missions
   * Creates a new mission and its initial main conversation atomically.
   */
  static createMission(req: Request, res: Response, next: NextFunction): void {
    try {
      const validatedBody = createMissionSchema.parse(req.body);
      const result = missionRepository.createMissionWithMainConversation(validatedBody.objective);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/missions/:id
   * Retrieves a mission and all associated conversations (main and sidequests).
   */
  static getMission(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = missionRepository.getMissionWithConversations(id);

      if (!result) {
        throw ApiError.notFound(`Mission with ID ${id} not found.`);
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/missions
   * Lists recent missions.
   */
  static listMissions(_req: Request, res: Response, next: NextFunction): void {
    try {
      const missions = missionRepository.listMissions();
      res.status(200).json({ missions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/missions/:id/sidequests
   * Creates a new SideQuest conversation linked to an existing mission.
   */
  static createSideQuest(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id: missionId } = idParamSchema.parse(req.params);
      const mission = missionRepository.getMissionById(missionId);

      if (!mission) {
        throw ApiError.notFound(`Mission with ID ${missionId} not found.`);
      }

      const validatedBody = createSideQuestSchema.parse(req.body);
      const sideQuest = conversationRepository.createSideQuestConversation(
        missionId,
        validatedBody.topic
      );

      res.status(201).json({ sideQuest });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/conversations/:id/messages
   * Retrieves messages for a conversation in chronological order.
   */
  static getConversationMessages(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id: conversationId } = idParamSchema.parse(req.params);
      const conversation = conversationRepository.getConversationById(conversationId);

      if (!conversation) {
        throw ApiError.notFound(`Conversation with ID ${conversationId} not found.`);
      }

      const messages = messageRepository.getMessagesByConversationId(conversationId);
      res.status(200).json({
        conversationId,
        type: conversation.type,
        topic: conversation.topic,
        messages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/conversations/:id/return-to-mission
   * Synthesizes SideQuest learnings into structured summary, saves to sidequest_memories,
   * updates mission memory decisions, and returns IDs for continuing the main mission.
   */
  static async returnToMission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: conversationId } = idParamSchema.parse(req.params);
      const result = await returnToMissionService.returnToMission(conversationId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
