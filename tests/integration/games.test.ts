import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import app from "app";
import { createConsole } from "../factories/consoles-factory";
import { createGame, gameBody } from "../factories/games-factory";

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /games', () => {
    it('should respond with status 200 with games empty', async () => {
        const response = await server.get('/games');
        
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual([]);
    });

    it('should respond with status 200 with games added', async () => {
        const consoleCreated = await createConsole();
        const game = await createGame(consoleCreated.id);

        const response = await server.get('/games');
       
        expect(response.status).toEqual(httpStatus.OK);
        
        expect(response.body).toEqual([
            {
                Console: {
                    id: consoleCreated.id || game.consoleId,
                    name: consoleCreated.name,
                },
                consoleId: consoleCreated.id || game.consoleId,
                id: game.id,
                title: game.title,
            }
        ]);
    });
});

describe('GET /games/:id', () => {
    it('should respond with status 404 if invalid id', async () => {
        const response = await server.get('/games/3');
        
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 with games required', async () => {
        const consoleCreated = await createConsole();
        const game = await createGame(consoleCreated.id);

        const response = await server.get(`/games/${game.id}`);
       
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            {
                id: game.id,
                title: game.title,
                consoleId: game.consoleId
            }
        );
    });
});

describe('POST /games', () => {
    it('should respond with status 422 if invalid body', async () => {
        const body = {};
        const response = await server.post('/games').send(body);
        
        expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond with status 409 if game already exist', async () => {
        const consoleCreated = await createConsole();
        const gameCreated = await createGame(consoleCreated.id);
        
        const body = await gameBody(gameCreated.title, consoleCreated.id);
        const response = await server.post('/games').send(body);
        console.log('body', response.body)
        expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it('should respond with status 409 if console id does not exist', async () => {
        const body = await gameBody('', 2);
        const response = await server.post('/games').send(body);
        
        expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it('should respond with status 201 if game is posted', async () => {
        const consoleCreated = await createConsole();
        const body = await gameBody('', consoleCreated.id);
        const response = await server.post('/games').send(body);

        expect(response.status).toEqual(httpStatus.CREATED);
    })

});