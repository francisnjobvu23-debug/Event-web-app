"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const zod_1 = require("zod");
const EventBodySchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    date: zod_1.z.string(),
    location: zod_1.z.string(),
    organizerId: zod_1.z.number(),
});
const eventRoutes = (app) => {
    // Get all approved events
    app.get("/events", async () => {
        const events = await client_1.default.event.findMany({
            where: { approved: true },
        });
        return events;
    });
    // Create new event
    app.post("/events", {
        body: EventBodySchema,
        handler: async ({ body, set }) => {
            const event = await client_1.default.event.create({
                data: {
                    title: body.title,
                    description: body.description,
                    date: new Date(body.date),
                    location: body.location,
                    organizerId: body.organizerId.toString(),
                },
            });
            set.status = 201;
            return event;
        },
    });
};
exports.eventRoutes = eventRoutes;
