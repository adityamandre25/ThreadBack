import { Router } from 'express';
import { aiRouter } from './ai.routes';
import { missionRouter } from './mission.routes';
import { conversationRouter } from './conversation.routes';
import { AiController } from '../controllers/ai.controller';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', AiController.handleHealth);

// AI subroutes
apiRouter.use('/ai', aiRouter);

// Mission operations
apiRouter.use('/missions', missionRouter);

// Conversation operations
apiRouter.use('/conversations', conversationRouter);
