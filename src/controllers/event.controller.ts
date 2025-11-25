import { Elysia, t } from "elysia";
import prisma from "../prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";
import { assertRole } from "../utils/role.utils";
import { broadcastMessage } from "../services/websocket.service";

// Type definitions for event validation
const eventBody = t.Object({
  title: t.String(),
  description: t.String(),
  date: t.String({ format: 'date-time' }),
  location: t.String(),
});

export const eventController = new Elysia({ prefix: "/events" })
  .use(authMiddleware)
  .get("/", async ({ store }) => {
    const user = (store as any).user;
    // Non-admins only see approved events
    if (user && user.role === 'ADMIN') {
      const events = await prisma.event.findMany({
        include: { organizer: { select: { email: true } }, rsvps: true }
      });
      return { events };
    }

    const events = await prisma.event.findMany({
      where: { approved: true },
      include: { organizer: { select: { email: true } }, rsvps: true }
    });
    return { events };
  })
  .post("/", async ({ body, store }) => {
    const user = (store as any).user;
    // Only organizers can create events
    assertRole(user, 'ORGANIZER');

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        location: body.location,
        organizerId: user.userId,
      },
      include: {
        organizer: { select: { email: true } },
      },
    });

    // broadcast new event
    broadcastMessage({ type: 'EVENT_CREATED', payload: event });

    return { event };
  }, {
    body: eventBody
  })
  .get("/:id", async ({ params }) => {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { organizer: { select: { email: true } }, rsvps: true },
    });

    if (!event) {
      return new Response('Not Found', { status: 404 });
    }

    return { event };
  })
  .put("/:id", async ({ params, body, store }) => {
    const user = (store as any).user;

    const event = await prisma.event.findUnique({ where: { id: params.id } });
    if (!event) return new Response('Not Found', { status: 404 });

    // Only organizer of the event or admin can update
    if (!(user.role === 'ADMIN' || event.organizerId === user.userId)) {
      return new Response('Forbidden', { status: 403 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        location: body.location,
      },
    });

    broadcastMessage({ type: 'EVENT_UPDATED', payload: updatedEvent });

    return { event: updatedEvent };
  }, {
    body: eventBody
  })
  .delete("/:id", async ({ params, store }) => {
    const user = (store as any).user;

    const event = await prisma.event.findUnique({ where: { id: params.id } });
    if (!event) return new Response('Not Found', { status: 404 });

    if (!(user.role === 'ADMIN' || event.organizerId === user.userId)) {
      return new Response('Forbidden', { status: 403 });
    }

    await prisma.event.delete({ where: { id: params.id } });

    broadcastMessage({ type: 'EVENT_DELETED', payload: { id: params.id } });

    return { message: "Event deleted successfully" };
  })
  .put("/:id/approve", async ({ params, store }) => {
    const user = (store as any).user;
    // Only admin can approve
    assertRole(user, 'ADMIN');

    const event = await prisma.event.update({
      where: { id: params.id },
      data: { approved: true },
    });

    broadcastMessage({ type: 'EVENT_APPROVED', payload: event });

    return { event };
  });