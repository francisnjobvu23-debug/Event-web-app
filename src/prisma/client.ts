import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// ensure this file is treated as a module
export {};
