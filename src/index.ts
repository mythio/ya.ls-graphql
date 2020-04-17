import http from 'http';

import app from './server';
import config from './core/config';
import logger from './core/Logger';

const server = http.createServer(app);
let currentApp = app;

server.listen(config.port, () => { logger.info(`🚀 Server ready at ${config.port}`) });

if (module.hot) {
  module.hot.accept(() => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
  module.hot.dispose(() => server.close());
}