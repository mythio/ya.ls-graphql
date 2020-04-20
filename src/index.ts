import http from 'http';

import app from './server';
import { config } from './core/config';
import logger from './core/Logger';

const server = http.createServer(app);

server.listen(config.port, () => { logger.info(`🚀  Server ready at port ${config.port}`) });

if (module.hot) {
	module.hot.accept();
	module.hot.dispose(() => server.close());
}