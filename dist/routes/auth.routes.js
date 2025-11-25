"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const RegisterBody = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const LoginBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const authRoutes = (app) => {
    // Register new user
    app.post("/auth/register", {
        body: RegisterBody,
        handler: async function ({ body, set, }) {
            const hashedPassword = await bcrypt_1.default.hash(body.password, 10);
            const user = await client_1.default.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                },
            });
            set.status = 201;
            return { message: "User registered successfully", userId: user.id };
        },
    });
    // Login user
    app.post("/auth/login", {
        handler: async ({ body, set, }) => {
            const parsed = LoginBody.safeParse(body);
            if (!parsed.success) {
                set.status = 400;
                return { error: "Invalid request body" };
            }
            const { email, password } = parsed.data;
            const user = await client_1.default.user.findUnique({ where: { email } });
            if (!user) {
                set.status = 401;
                return { error: "Invalid email or password" };
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                set.status = 401;
                return { error: "Invalid email or password" };
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
            return { message: "Login successful", token };
        },
    });
};
exports.authRoutes = authRoutes;
