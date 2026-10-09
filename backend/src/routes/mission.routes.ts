import { Router } from 'express';
import { MissionController } from '../controllers/mission.controller';

export const missionRouter = Router();

missionRouter.post('/', MissionController.createMission);
missionRouter.get('/', MissionController.listMissions);
missionRouter.get('/:id', MissionController.getMission);
missionRouter.post('/:id/sidequests', MissionController.createSideQuest);
