import { faker } from "@faker-js/faker";
import prisma from "config/database";

export async function createGame(id?: number) {
    return await prisma.game.create({
        data: {
            title: faker.commerce.productName(),
            consoleId: id,
        }
    })
}

export async function gameBody(title?: string, id?: number) {
    return {
        title: title || faker.commerce.productName(),
        consoleId: id,
    }
}