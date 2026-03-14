import express from "express";
import cors from "cors";
import type { Express } from "express";
import { env } from "./config/env";
import { errorMiddleware } from "./common/errors/errorMiddleware";
import { InMemoryRoomsRepository } from "./modules/rooms/rooms.memory";
import { RoomsService } from "./modules/rooms/rooms.service";
import { createRootRouter } from "./routes";

export function createApp(): { app: Express; roomsService: RoomsService } {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(express.json());

  const roomsRepository = new InMemoryRoomsRepository();
  const roomsService = new RoomsService(roomsRepository);

  app.use("/api", createRootRouter(roomsService));

  app.use(errorMiddleware);

  return { app, roomsService };
}

