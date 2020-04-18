export const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
};

export const apolloConfig = {
  introspection: process.env.APOLLO_INTROSPECTION === 'true',
  playground: process.env.APOLLO_PLAYGROUND === 'true'
};

export const loggerConfig = {
  date: process.env.LOGGER_DATE,
  maxSize: process.env.LOGGER_MAX_SIZE,
  maxFiles: process.env.LOGGER_MAX_FILES
};

export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_DAYS),
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
};