import { Request, Response, Router } from 'express';
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/email.service";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      
      // Validate email and password
      if (!email || !password || password.length < 8) {
        return res.status(400).json({ 
          message: "Email and password (min 8 characters) are required" 
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { 
          email, 
          password: hashed, 
          role: role || "ATTENDEE" 
        },
      });

      // send mock welcome/verification email (Ethereal)
      try {
        const info: any = await sendWelcomeEmail(user.email);
        const preview = info && typeof info === 'object' ? info : null;

        res.status(201).json({
          message: "User created",
          userId: user.id,
          emailPreview: preview && (preview.previewUrl || null)
        });
      } catch (emailErr) {
        // If email sending fails, still return success but include a note
        res.status(201).json({
          message: "User created (email failed)",
          userId: user.id
        });
      }
    } catch (e) {
      // Check for Prisma's unique constraint violation error
      if ((e as any)?.code === 'P2002') {
        res.status(409).json({ error: "A user with this email already exists." });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }

      // General server error
      set.status = 500;
      return { error: "An unexpected error occurred during signup." };
    }
  }, {
    body: authBody.signup
  })
  .post("/login", async ({ body, set }) => {
    try {
      const user = await prisma.user.findUnique({ where: { email: body.email } });

      if (!user) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }

      const valid = await bcrypt.compare(body.password, user.password);
      if (!valid) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
      return { token };
    } catch (e) {
      set.status = 500;
      return { error: "An unexpected error occurred during login." };
    }
  }, {
    body: authBody.login
  });
