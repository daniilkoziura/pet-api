import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute } from './route.interface';
export { Router } from 'express';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.methhod}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.methhod](route.path, pipeline);
		}
	}
}
