import { createMiddleware } from "@abledotdev/app-environment";
import * as DueDate from "@abledotdev/able--doable--due-date/dist/server-functions";
import { getSession } from "@blitzjs/core/server";
import db from "db";
import { Request, Response } from "express";

async function authenticate(request: Request, response: Response) {
  const { userId } = await getSession(request, response);
  if (userId) {
    return { userId };
  } else {
    response.status(401).send("Authentication Failure");
    throw new Error("Authentication Failure");
  }
}

const sharedHostContext = { db, authenticate };

export default createMiddleware({
  serverFunctions: [
    DueDate.createHandleRequest<DueDate.HostContext>({
      mode: "production",
      hostContext: sharedHostContext,
    }),
  ],
});
