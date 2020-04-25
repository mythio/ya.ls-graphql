import http from "http";

import { config } from "./core/config";
import logger from "./core/Logger";
import app from "./server";

const server = http.createServer(app);

server.listen(config.port, () => {
	logger.info(`🚀 Server ready at port ${config.port}`);
});

if (module.hot) {
	module.hot.accept();
	module.hot.dispose(() => server.close());
}
