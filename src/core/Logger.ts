import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { loggerConfig } from './config';

const logger = createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
				format.prettyPrint(),
				format.colorize(),
			),
		})
	],
	exceptionHandlers: [
		new DailyRotateFile({
			filename: './logs/%DATE%.log',
			datePattern: loggerConfig.date,
			zippedArchive: true,
			maxSize: loggerConfig.maxSize,
			maxFiles: loggerConfig.maxFiles,
			format: format.combine(
				format.errors({ stack: true }),
				format.prettyPrint(),
				format.colorize(),
			)
		}),
	],
	exitOnError: false,
});

export default logger;