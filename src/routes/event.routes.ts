import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /events - list approved events
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { approved: true },
      include: { organizer: { select: { email: true } }, rsvps: true }
    });
    res.json(events);
  } catch (e) {
    console.error('Error fetching events', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /events - create a new event (authenticated users only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const organizerId = req.user?.userId;
    if (!organizerId) return res.status(401).json({ error: 'Unauthorized' });

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizerId,
        // Auto-approve during development for faster feedback; in production require manual approval
        approved: process.env.NODE_ENV !== 'production' ? true : false,
      }
    });

    res.status(201).json(event);
  } catch (e) {
    console.error('Error creating event', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// make this file a module
export {};