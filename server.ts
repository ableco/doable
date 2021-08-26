import { log } from "@blitzjs/display";
import { getSession } from "blitz";
import blitz from "blitz/custom-server";
import cookieParser from "cookie-parser";
import db from "db";
import {
  createHandleRequest,
  HostContext,
} from "@ableco/job-request--due-date/dist/server-functions";
import express, { Request, RequestHandler, Response } from "express";
import { createServer } from "http";
import { initIO, setupRoomsOnConnection } from "io";
import { parse } from "url";

const handleAbledevRequest = createHandleRequest<HostContext>({
  mode: "production",
  hostContext: {
    db,
    authenticate: async (request: Request, response: Response) => {
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

function createAbledevMiddleware(
  handleRequest: (
    request: express.Request,
    response: express.Response,
  ) => Promise<any>,
) {
  const middleware: RequestHandler = async (request, response, next) => {
    if (request.url.startsWith("/abledev")) {
      request.headers["anti-csrf"] =
        request.cookies[`${global.sessionConfig.cookiePrefix}_sAntiCsrfToken`];
      await handleRequest(request, response);
    } else {
      next();
    }
  };

  return middleware;
}

async function startServer() {
  await app.prepare();

  const expressServer = express();
  expressServer.use(cookieParser());
  expressServer.use(createAbledevMiddleware(handleAbledevRequest));

  expressServer.use(async (request, response) => {
    const parsedUrl = parse(request.url!, true);
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
