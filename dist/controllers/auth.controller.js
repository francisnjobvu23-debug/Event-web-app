"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const signup = async (req, res) => {
    const { email, password, role } = req.body;
    const hashed = await bcrypt_1.default.hash(password, 10);
    const user = await client_1.default.user.create({
        data: { email, password: hashed, role: role || "ATTENDEE" }
    });
    // Normally send email with Ethereal
    res.status(201).json({ message: "User created", userId: user.id });
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await client_1.default.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
};
exports.login = login;
