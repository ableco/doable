import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz";

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "doable",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
};

module.exports = config;
