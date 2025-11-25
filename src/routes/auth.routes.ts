import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../services/email.service';
import { authMiddleware, getUserFromRequest } from '../middleware/auth.middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, role: role || 'ATTENDEE' } });

    // attempt to send welcome email but don't fail the request if email sending fails
    try {
      const info = await sendWelcomeEmail(user.email);
      return res.status(201).json({ message: 'User created', userId: user.id, previewUrl: info.previewUrl || null });
    } catch (emailErr) {
      return res.status(201).json({ message: 'User created (email failed)', userId: user.id });
    }
  } catch (e: any) {
    if (e?.code === 'P2002') return res.status(409).json({ error: 'A user with this email already exists.' });
    console.error('Signup error', e);
    return res.status(500).json({ error: 'An unexpected error occurred during signup.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (e) {
    console.error('Login error', e);
    return res.status(500).json({ error: 'An unexpected error occurred during login.' });
  }
});

// Return current logged-in user info
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    // authMiddleware attaches the token payload to req.user
    const anyReq: any = req;
    const payload = anyReq.user as any;
    if (!payload?.userId) return res.status(400).json({ error: 'Invalid token payload' });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (e) {
    console.error('Error in /auth/me', e);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

// make this a module
export {};