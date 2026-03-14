import { Router } from "express";
import type { RoomsService } from "./modules/rooms/rooms.service";
import { createRoomsRouter } from "./modules/rooms/rooms.routes";

export function createRootRouter(roomsService: RoomsService): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({
      ok: true,
      message: "TypeBoster API",
      endpoints: {
        createRoom: "POST /api/rooms",
        joinRoom: "POST /api/rooms/:roomId/join",
        startGame: "POST /api/rooms/:roomId/start",
      },
    });
  });

  router.use("/rooms", createRoomsRouter(roomsService));

  return router;
}

