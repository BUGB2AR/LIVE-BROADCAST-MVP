import { NextFunction, Request, Response, Router } from 'express';
import { StreamController } from '../controllers/StreamController';
import { authMiddleware } from '../../../../../shared/infra/http/middlewares/auth';
import { AppError } from '../../../../../shared/errors/AppError';
import { UserRole } from '../../../../user/domain/User';

const streamRoutes = Router();
const streamController = new StreamController();

const isStreamer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.Streamer) {
    throw new AppError('Only streamers are allowed to perform this action.', 403);
  }
  next();
};

streamRoutes.post('/streams', authMiddleware, isStreamer, streamController.create);
streamRoutes.patch('/streams/:streamId/start', authMiddleware, isStreamer, streamController.start);
streamRoutes.patch('/streams/:streamId/end', authMiddleware, isStreamer, streamController.end);
streamRoutes.get('/streams/active', streamController.listActive);

export { streamRoutes };