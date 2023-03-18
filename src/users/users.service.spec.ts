import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();

let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersService = container.get<IUserService>(TYPES.UserService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('Create User', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				id: 1,
				email: user.email,
				name: user.name,
				password: user.password,
			}),
		);

		createdUser = await usersService.createUser({
			email: 'd@k.com',
			name: 'Cyber Husky',
			password: '123',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('123');
	});

	it('Validate User - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const result = await usersService.validateUser({
			email: 'd@k.com',
			password: '123',
		});

		expect(result).toBeTruthy();
	});

	it('Validate User - not found', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const isUserExsist = await usersService.isUserExsist('neverfound@no.com');

		const result = await usersService.validateUser({
			email: 'neverfound@no.com',
			password: '123123123',
		});

		expect(isUserExsist).toEqual(null);
		expect(result).toEqual(false);
	});

	it('Validate User - failed with incorrect password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const result = await usersService.validateUser({
			email: 'd@k.com',
			password: '123123',
		});

		expect(result).toBeFalsy();
	});
});

afterAll(() => {
	// close externlal connection
});
