import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { injectable, inject } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('[ConfigService] Failed read file .env or not exsist');
		} else {
			this.loggerService.log('[ConfigService] .env loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	public get<T extends string | number>(key: string): T {
		return this.config[key] as T;
	}
}
