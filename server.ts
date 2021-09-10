import { log } from "@blitzjs/display";
import abledevMiddleware from "abledev-middleware";
import blitz from "blitz/custom-server";
import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import { initIO, setupRoomsOnConnection } from "io";
import { parse } from "url";

const { PORT = "3000" } = process.env;
const dev = process.env.NODE_ENV !== "production";
const app = blitz({ dev });
const blitzHandle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

  const expressServer = express();
  expressServer.use(cookieParser());
  expressServer.use(abledevMiddleware);

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
