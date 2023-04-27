import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import app from "app";
import { consoleBody, createConsole } from "../factories/consoles-factory";

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /consoles', () => {
    it('should respond with status 200 with consoles empty', async () => {
        const response = await server.get('/consoles');
        
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual([]);
    });

    it('should respond with status 200 with consoles added', async () => {
        const console = await createConsole();

        const response = await server.get('/consoles');
       
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual([
            {
                id: console.id,
                name: console.name
            }
        ]);
    });
});

describe('GET /consoles/:id', () => {
    it('should respond with status 404 if invalid id', async () => {
        const response = await server.get('/consoles/3');
        
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 with consoles required', async () => {
        const console = await createConsole();

        const response = await server.get(`/consoles/${console.id}`);
       
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            {
                id: console.id,
                name: console.name
            }
        );
    });
});

describe('POST /consoles', () => {
    it('should respond with status 402 if invalid body', async () => {
        const body = {};
        const response = await server.post('/consoles').send(body);
        
        expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond with status 409 if console already exist', async () => {
        const consoleCreated = await createConsole();
        
        const body = await consoleBody(consoleCreated.name);
        const response = await server.post('/consoles').send(body);
        
        expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it('should respond with status 201 if console is posted', async () => {
        const body = await consoleBody();
        const response = await server.post('/consoles').send(body);

        expect(response.status).toEqual(httpStatus.CREATED);
    })

});