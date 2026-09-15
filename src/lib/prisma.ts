import { PrismaClient } from  '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// function to instantiate the client  
const prismaClientSingleton = () => {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL as string,
    });
    return new PrismaClient({adapter})
}

// global variable for reuseability
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

//use existing client if available otherwise create one
const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma