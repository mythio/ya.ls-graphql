import logger from "../core/Logger";
import mongoose from "mongoose";
import { dbConfig } from '../core/config';

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  // connectTimeoutMs: 10000,
  // socketTimoutMs: 30000
};

mongoose.connect(dbConfig.dbURI, options)
  .then(() => { logger.info('Mongoose connected') })
  .catch(err => {
    logger.info('Mongoose failed to connect')
    logger.error(err);
  });

mongoose.connection.on('connected', () => {
  logger.info(`Mongoose default connection open to ${dbConfig.dbURI}`)
});

mongoose.connection.on('error', err => {
  logger.error(`Mongoose default connection error ${err}`)
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose connection terminated');
    process.exit(0);
  });
});