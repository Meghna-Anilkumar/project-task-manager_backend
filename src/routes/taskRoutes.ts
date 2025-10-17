import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();
const taskController = new TaskController();

router.post('/:projectId/tasks', (req, res) => taskController.createTask(req, res));
router.get('/:projectId/tasks', (req, res) => taskController.getTasksByProject(req, res));
router.put('/tasks/:id', (req, res) => taskController.updateTask(req, res));
router.delete('/tasks/:id', (req, res) => taskController.deleteTask(req, res));

export default router;