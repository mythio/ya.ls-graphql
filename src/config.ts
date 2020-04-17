interface Config {
  apollo: {
    introspection: boolean;
    playground: boolean;
  };
  environment: string;
  logger: {
    date: string;
    maxSize: string;
    maxFiles: string;
  }
  port: number | string;
}

const config: Config = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true'
  },
  environment: process.env.NODE_ENV,
  logger: {
    date: process.env.LOGGER_DATE,
    maxSize: process.env.LOGGER_MAX_SIZE,
    maxFiles: process.env.LOGGER_MAX_FILES
  },
  port: process.env.PORT || 4000,
};

export default config;