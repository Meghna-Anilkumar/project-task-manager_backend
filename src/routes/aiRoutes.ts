import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();
const aiController = new AIController();

router.post('/:projectId/summarize', (req, res) => aiController.summarizeProject(req, res));
router.post('/qa', (req, res) => aiController.askQuestion(req, res));
router.post('/:projectId/ask', (req, res) => aiController.askQuestion(req, res)); 

export default router;