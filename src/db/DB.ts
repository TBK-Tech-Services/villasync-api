import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log : ["query" , "info" , "error" , "warn"],
    errorFormat : "pretty"
})

export default prisma;