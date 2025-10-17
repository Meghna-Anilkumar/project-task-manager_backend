import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();
const aiController = new AIController();

router.get('/:projectId/summarize', (req, res) => aiController.summarizeProject(req, res));
router.post('/:projectId/ask', (req, res) => aiController.askQuestion(req, res));

export default router;