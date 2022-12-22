const request = require('supertest');
const app = require('../../app');

const completeLaunchData = {
    mission: 'Some mission',
    rocket: 'Some mission',
    target: 'Kepler',
    launchDate: 'January 4, 1993'
};

const launchDataWithoutDate = {
    mission: 'Some mission',
    rocket: 'Some mission',
    target: 'Kepler',
};

const invalidLaunchDate = {
    mission: 'Some',
    rocket: 'Some',
    target: 'Kepler',
    launchDate: 'Text Text'
};

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
});

describe('Test POST /launches', () => {
    test('It should respond with 201 created', async () => {
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
    
        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
        
        expect(response.body).toStrictEqual({
            error: 'Missing a required property, please try again...',
        });
    });

    test('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(invalidLaunchDate)
        .expect('Content-Type', /json/)
        .expect(400);
        
        expect(response.body).toStrictEqual({
            error: 'Not a valid date...',
        });
    });
});