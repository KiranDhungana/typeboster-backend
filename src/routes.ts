import { Router } from "express";
import type { RoomsService } from "./modules/rooms/rooms.service";
import { createRoomsRouter } from "./modules/rooms/rooms.routes";

export function createRootRouter(roomsService: RoomsService): Router {
  const router = Router();

  router.use("/rooms", createRoomsRouter(roomsService));

  return router;
}

