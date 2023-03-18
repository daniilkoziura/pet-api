import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { HTTPError } from '../errors/http-error.class';
import { IMiddleWare } from './middleware.interface';

export class AuthGuardMiddleware implements IMiddleWare {
	// constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		// if (req.headers.authorization) {
		// 	verify(req.headers.authorization.split(' ')[1], this.secret, (error) => {
		// 		if (error) {
		// 			res.status(401).send(error);
		// 		} else {
		// 			next();
		// 		}
		// 	});
		// } else {
		// 	next(new HTTPError(401, 'Unauthorized'));
		// }
		if (req.user) next();
		else next(new HTTPError(401, 'Unauthorized'));
	}
}
