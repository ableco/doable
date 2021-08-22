import { RequestContext } from "@ableco/abledev-dev-environment";
import { log } from "@blitzjs/display";
import { getSession } from "blitz";
import blitz from "blitz/custom-server";
import cookieParser from "cookie-parser";
import db from "db";
// In the future this line won't be needed because of
// https://github.com/microsoft/TypeScript/issues/33079
// @ts-ignore
import { createHandleRequest } from "@ableco/job-request--due-date/server-functions";
import express from "express";
import { createServer } from "http";
import { initIO, setupRoomsOnConnection } from "io";
import { parse } from "url";

const handleAbledevRequest = createHandleRequest({
  mode: "production",
  hostContext: {
    db,
    authenticate: async (
      request: RequestContext["request"],
      response: RequestContext["response"],
    ) => {
      const session = await getSession(request, response);
      if (session.userId) {
        return { userId: session.userId };
      } else {
        response.status(401).send("Authentication Failure");
        throw new Error("Authentication Failure");
      }
    },
  },
});

const { PORT = "3000" } = process.env;
const dev = process.env.NODE_ENV !== "production";
const app = blitz({ dev });
const blitzHandle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

  const expressServer = express();
  expressServer.use(cookieParser());

  expressServer.use(async (request, response) => {
    const parsedUrl = parse(request.url!, true);

    // This would probably be inside
    if (parsedUrl.pathname?.startsWith("/abledev")) {
      // Blitz-specific trick to allow passing an anti-csrf header.
      // Another alternative would have been to pass the header from abledev-react,
      // but it would require a setup process in the frontend to configure special
      // headers.
      request.headers["anti-csrf"] =
        request.cookies[`${global.sessionConfig.cookiePrefix}_sAntiCsrfToken`];

      handleAbledevRequest(request, response);
    }

    await blitzHandle(request, response, parsedUrl);
  });

  const httpServer = createServer(expressServer);

  const io = initIO();
  io.attach(httpServer);
  setupRoomsOnConnection(io);

  httpServer.listen(PORT, () => {
    log.success(`Ready on http://localhost:${PORT}`);
  });
}

startServer();
