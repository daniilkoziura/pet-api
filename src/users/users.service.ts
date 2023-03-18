import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private cS: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.cS.get<number>('SALT');

		await newUser.setPassword(password, salt);

		if (await this.isUserExsist(email)) {
			return null;
		}

		return await this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const currUser = await this.isUserExsist(email);

		if (!currUser) {
			return Promise.resolve(false);
		}

		const user = new User(currUser.email, currUser.name, currUser.password);
		return await user.validateHash(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return await this.isUserExsist(email);
	}

	async isUserExsist(email: string): Promise<UserModel | null> {
		const currUser = await this.userRepository.find(email);

		if (currUser) {
			return currUser;
		}

		return null;
	}
}
