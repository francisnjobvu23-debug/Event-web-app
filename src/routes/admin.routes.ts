import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Middleware to ensure only admins access these routes
const adminOnly = (req: AuthRequest, res: Response, next: Function) => {
  const role = req.user?.role;
  if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// GET /admin/users - list all users (admin only)
router.get('/users', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
    res.json(users);
  } catch (e) {
    console.error('Error fetching users', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /admin/users/:id/role - update a user's role (admin only)
router.put('/users/:id/role', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'Role is required' });

  try {
    const updated = await prisma.user.update({ where: { id: userId }, data: { role } });
    res.json({ id: updated.id, email: updated.email, role: updated.role });
  } catch (e) {
    console.error('Error updating user role', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/pending-events - list events pending approval
router.get('/pending-events', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({ where: { approved: false }, include: { organizer: { select: { email: true } } } });
    res.json(events);
  } catch (e) {
    console.error('Error fetching pending events', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /admin/events/:id/approve - approve an event
router.post('/events/:id/approve', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  try {
    const updated = await prisma.event.update({ where: { id: eventId }, data: { approved: true } });
    res.json(updated);
  } catch (e) {
    console.error('Error approving event', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /admin/events/:id - delete an event (admin only)
router.delete('/events/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  try {
    await prisma.rSVP.deleteMany({ where: { eventId } });
    await prisma.event.delete({ where: { id: eventId } });
    res.json({ message: 'Event deleted' });
  } catch (e) {
    console.error('Error deleting event', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/stats - simple stats for admin dashboard
router.get('/stats', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalEvents = await prisma.event.count();
    const totalRsvps = await prisma.rSVP.count();
    res.json({ totalUsers, totalEvents, totalRsvps });
  } catch (e) {
    console.error('Error fetching admin stats', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// make module
export {};
