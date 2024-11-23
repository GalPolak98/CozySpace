import express from 'express';
import userRoutes from './userRoutes';
import therapistRoutes from './therapistRoutes';
const router = express.Router();

router.use('/users', userRoutes);
router.use('/therapists', therapistRoutes);

router.post('/api/save-push-token', (req, res) => {
    const { token } = req.body;
    if (token) {
      console.log('Received push token:', token);
      res.status(200).send('Push token saved');
    } else {
      res.status(400).send('Push token is required');
    }
  });
  
export default router;