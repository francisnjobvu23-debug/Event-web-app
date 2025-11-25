"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (app) => app.onRequest(async (ctx) => {
    const authHeader = ctx.request.headers.get("authorization");
    if (!authHeader)
        return new Response("Unauthorized", { status: 401 });
    const token = authHeader.split(" ")[1];
    if (!token)
        return new Response("Unauthorized", { status: 401 });
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // attach user to ctx.store to keep types compatible with Elysia's context
        ctx.store.user = user;
    }
    catch {
        return new Response("Invalid token", { status: 401 });
    }
});
exports.authMiddleware = authMiddleware;
