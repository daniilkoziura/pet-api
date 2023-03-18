import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'd@k.com', password: '123' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test2@mail.com', password: '123123' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test2@mail.com', password: '__123123' });
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test2@mail.com', password: '123123' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe(login.body.email);
	});

	it('Info - failed', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer undefined`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
