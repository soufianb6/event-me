import { Router } from 'express';
import usersRouter from './users.ts';
import eventsRouter from './events.ts';


const router = Router();

router.use('/users', usersRouter);
router.use('/events', eventsRouter);


export default router;
