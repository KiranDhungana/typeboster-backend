import { Router } from "express";
import { validate } from "../../common/middleware/validate";
import {
  createRoomSchema,
  joinRoomBodySchema,
  joinRoomParamsSchema,
  startGameBodySchema,
  startGameParamsSchema,
} from "./rooms.schemas";
import { RoomsController } from "./rooms.controller";
import type { RoomsService } from "./rooms.service";

export function createRoomsRouter(roomsService: RoomsService): Router {
  const router = Router();
  const controller = new RoomsController(roomsService);

  router.post(
    "/",
    validate(createRoomSchema, "body"),
    controller.createRoom,
  );

  router.post(
    "/:roomId/join",
    validate(joinRoomParamsSchema, "params"),
    validate(joinRoomBodySchema, "body"),
    controller.joinRoom,
  );

  router.post(
    "/:roomId/start",
    validate(startGameParamsSchema, "params"),
    validate(startGameBodySchema, "body"),
    controller.startGame,
  );

  return router;
}

