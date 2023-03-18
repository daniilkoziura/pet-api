import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exeption.filter.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ExceptionFilter) private eF: IExceptionFilter,
		@inject(TYPES.ConfigService) private cS: IConfigService,

		@inject(TYPES.UserController) private uC: UserController,
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.uC.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.eF.catch.bind(this.eF));
	}

	useMiddlware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.cS.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	public async init(): Promise<void> {
		this.useMiddlware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server running on http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
