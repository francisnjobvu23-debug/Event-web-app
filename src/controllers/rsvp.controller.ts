import { Elysia, t } from "elysia";
import prisma from "../prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";
import { assertRole } from "../utils/role.utils";
import { broadcastMessage } from "../services/websocket.service";

const rsvpBody = t.Object({
  status: t.Enum({ GOING: "GOING", MAYBE: "MAYBE", NOT_GOING: "NOT_GOING" }),
});

export const rsvpController = new Elysia({ prefix: "/events/:eventId/rsvp" })
  .use(authMiddleware)
  .post("/", async ({ params, body, store }) => {
    const user = (store as any).user;

    // Only attendees can RSVP (admins/organizers could as well but requirement suggests attendee)
    assertRole(user, ['ATTENDEE', 'ORGANIZER', 'ADMIN']);

    const event = await prisma.event.findUnique({ where: { id: params.eventId } });
    if (!event) return new Response('Not Found', { status: 404 });

    const rsvp = await prisma.rSVP.upsert({
      where: {
        userId_eventId: {
          userId: user.userId,
          eventId: params.eventId,
        },
      },
      update: { status: body.status },
      create: { userId: user.userId, eventId: params.eventId, status: body.status },
    });

    broadcastMessage({ type: 'RSVP_UPDATED', payload: rsvp });

    return { rsvp };
  }, {
    body: rsvpBody
  })
  .get("/", async ({ params }) => {
    const rsvps = await prisma.rSVP.findMany({
      where: { eventId: params.eventId },
      include: { user: { select: { email: true } } },
    });

    return { rsvps };
  })
  .delete("/", async ({ params, store }) => {
    const user = (store as any).user;
    
    await prisma.rSVP.delete({
      where: { userId_eventId: { userId: user.userId, eventId: params.eventId } }
    });

    broadcastMessage({ type: 'RSVP_UPDATED', payload: { userId: user.userId, eventId: params.eventId, deleted: true } });

    return { message: "RSVP deleted successfully" };
  });
