import { Router } from 'express';
import { userRoutes } from './modules/user/infra/routes/userRoutes';
import { streamRoutes } from './modules/stream/infra/http/routes/streamRoutes';

// import { subscriptionRoutes } from './modules/subscriptions/infra/http/routes/subscriptionRoutes';
// import { paymentRoutes } from './modules/payments/infra/http/routes/paymentRoutes';

const routes = Router();

routes.use('/api', userRoutes);
routes.use('/api', streamRoutes);
// routes.use('/api', subscriptionRoutes);
// routes.use('/api', paymentRoutes);

export { routes };