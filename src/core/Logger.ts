import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import config from '../config';

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
      datePattern: config.logger.date,
      zippedArchive: true,
      maxSize: config.logger.maxSize,
      maxFiles: config.logger.maxFiles,
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