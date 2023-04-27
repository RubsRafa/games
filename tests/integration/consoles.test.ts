import httpStatus from "http-status";
import faker from '@faker-js/faker';
import supertest from "supertest";
import { cleanDb } from "../helpers";
import app from "app";
import { createConsole } from "../factories/consoles-factory";

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /consoles', () => {
    it('should respond with status 200 with consoles empty', async () => {
        const response = await server.get('/consoles');
        
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
    });

    it('should respond with status 200 with consoles added', async () => {
        const console = await createConsole();

        const response = await server.get('/consoles');
       
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([
            {
                id: console.id,
                name: console.name
            }
        ]);
    });
})