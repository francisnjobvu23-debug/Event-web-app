"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elysia_1 = require("elysia");
const cors_1 = __importDefault(require("@elysiajs/cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = new elysia_1.Elysia()
    .use((0, cors_1.default)({ origin: "http://localhost:5173" }))
    .get("/events", async () => {
    const events = await prisma.event.findMany();
    return { events };
})
    .post("/events", async ({ body }) => {
    const { title, description, date, location, organizerId } = body;
    const event = await prisma.event.create({
        data: {
            title,
            description,
            date: new Date(date),
            location,
            organizer: {
                connect: { id: organizerId }
            }
        }
    });
    return { event };
});
app.listen(3000);
console.log("Server running on http://localhost:3000");
