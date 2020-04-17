import server from "./server";
import { logger } from "./core/Logger";
import { config } from "./config";

server
  .listen(config.port)
  .then(({ url }) => logger.info(`Server on ${url}`))
  .catch((err) => logger.error(err));

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}