import { Router } from 'express';
const router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

export default router;