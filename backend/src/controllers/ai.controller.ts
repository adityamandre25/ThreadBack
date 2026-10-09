import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { chatRequestSchema } from '../schemas/chat.schema';
import { sideQuestRequestSchema } from '../schemas/sidequest.schema';
import { mainAiService } from '../services/main-ai.service';
import { sideQuestService } from '../services/sidequest.service';
import { AiStatusResponse, HealthResponse } from '../types/ai.types';

export class AiController {
  /**
   * POST /api/ai/chat
   * Accepts validated mission objective and message history, calls Gemma inference,
   * and returns the generated reply.
   */
  static async handleChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedPayload = chatRequestSchema.parse(req.body);
      const result = await mainAiService.processChat(validatedPayload);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/sidequest/chat
   * Accepts validated mission objective, sideQuestTopic, and SideQuest message history.
   * Calls SideQuest Gemma inference and returns generated reply.
   */
  static async handleSidequestChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedPayload = sideQuestRequestSchema.parse(req.body);
      const result = await sideQuestService.processSideQuestChat(validatedPayload);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ai/status
   * Returns non-sensitive configuration status.
   * Never exposes the API key or any portion of it.
   */
  static handleStatus(_req: Request, res: Response): void {
    const statusResponse: AiStatusResponse = {
      configured: env.isAiConfigured,
      model: env.gemmaModel,
    };
    res.status(200).json(statusResponse);
  }

  /**
   * GET /api/health
   * Lightweight process health check.
   */
  static handleHealth(_req: Request, res: Response): void {
    const healthResponse: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
    res.status(200).json(healthResponse);
  }
}
