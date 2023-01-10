const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

console.log('[Database] Connected');

export default prisma;