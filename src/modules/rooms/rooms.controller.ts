import type { Request, Response, NextFunction } from "express";
import type { RoomsService } from "./rooms.service";
import type {
  CreateRoomInput,
  JoinRoomBody,
  JoinRoomParams,
  StartGameBody,
  StartGameParams,
} from "./rooms.schemas";

export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  createRoom = (req: Request<unknown, unknown, CreateRoomInput>, res: Response, next: NextFunction) => {
    try {
      const { hostName, maxPlayers, durationSeconds } = req.body;
      const result = this.roomsService.createRoom(hostName, maxPlayers, durationSeconds);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  joinRoom = (
    req: Request<JoinRoomParams, unknown, JoinRoomBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { roomId } = req.params;
      const { playerName } = req.body;
      const result = this.roomsService.joinRoom(roomId, playerName);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  startGame = (
    req: Request<StartGameParams, unknown, StartGameBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { roomId } = req.params;
      const { playerId } = req.body;
      this.roomsService.startGame(roomId, playerId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

