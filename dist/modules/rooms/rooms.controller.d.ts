import type { Request, Response, NextFunction } from "express";
import type { RoomsService } from "./rooms.service";
import type { CreateRoomInput, JoinRoomBody, JoinRoomParams, StartGameBody, StartGameParams } from "./rooms.schemas";
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    createRoom: (req: Request<unknown, unknown, CreateRoomInput>, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    joinRoom: (req: Request<JoinRoomParams, unknown, JoinRoomBody>, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    startGame: (req: Request<StartGameParams, unknown, StartGameBody>, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=rooms.controller.d.ts.map