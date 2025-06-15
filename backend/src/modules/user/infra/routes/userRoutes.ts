import { Router } from 'express';
import { UserController } from '../http/controllers/UserController';
import { authMiddleware } from '../../../../shared/infra/http/middlewares/auth';


const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/users', userController.create);
userRoutes.post('/users/authenticate', userController.authenticate);
userRoutes.get('/users/profile', authMiddleware, (req, res) => {
  return res.json({ message: 'Protected profile data', user: req.user });
});

export { userRoutes };