// import { PrismaClient } from '@prisma/client';

// declare global {
//   const prisma: PrismaClient | undefined;
// }

// declare global {
//   interface GlobalThis {
//     prisma: PrismaClient | undefined;
//   }
// }
// let prisma: PrismaClient;

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma;

import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof PrismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// async function checkConnection() {
//   try {
//     // Perform a simple query to check the connection
//     await prisma.$connect();
//     console.log("Database connection successful!");
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// checkConnection();
