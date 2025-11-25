"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpEvent = exports.createEvent = exports.getEvents = void 0;
// src/controllers/event.controller.ts
const client_1 = __importDefault(require("../prisma/client"));
const getEvents = async (c) => {
    const events = await client_1.default.event.findMany();
    return events;
};
exports.getEvents = getEvents;
// Create a new event (only ORGANIZER)
const createEvent = async (c) => {
    const { title, description, date, location, organizerId } = c.body;
    const event = await client_1.default.event.create({
        data: {
            title,
            description,
            date: new Date(date),
            location,
            organizerId,
        },
    });
    return { event };
};
exports.createEvent = createEvent;
// RSVP to an event
const rsvpEvent = async (c) => {
    const { status, userId } = c.body;
    const { id: eventId } = c.params;
    const rsvp = await client_1.default.rSVP.create({
        data: { status, eventId, userId },
    });
    return rsvp;
};
exports.rsvpEvent = rsvpEvent;
