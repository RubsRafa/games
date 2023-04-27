import { faker }  from "@faker-js/faker";
import prisma from "config/database";

export async function createConsole(name?: string) {
    return prisma.console.create({
        data: {
            name: faker.commerce.productAdjective() || name,
        }
    })
}

export async function consoleBody(name?: string) {
    return {
        name: name || faker.commerce.productAdjective(),
    }
}