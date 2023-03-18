import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Wrong email data' })
	email: string;

	@IsString({ message: 'Wrong name' })
	name: string;

	@IsString({ message: 'Wrong password' })
	password: string;
}
