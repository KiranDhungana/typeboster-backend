import type { RoomsEventsPublisher, RoomsRepository } from "./rooms.repository";
import type { Player, Room } from "./rooms.types";
export declare class RoomsService {
    private readonly repo;
    private eventsPublisher?;
    private roomTimers;
    constructor(repo: RoomsRepository);
    setEventsPublisher(publisher: RoomsEventsPublisher): void;
    createRoom(hostName: string, maxPlayers?: number, durationSeconds?: number): {
        roomId: string;
        hostId: string;
        maxPlayers: number;
        durationSeconds: number | undefined;
    };
    joinRoom(roomIdRaw: string, playerName: string): {
        roomId: string;
        playerId: string;
        players: Player[];
    };
    startGame(roomIdRaw: string, playerId: string): void;
    updatePlayerProgress(roomIdRaw: string, playerId: string, progress: number): Room;
    getRoom(roomIdRaw: string): Room | undefined;
    private startRoomTimer;
    private emitRoomUpdated;
    private emitGameStarted;
    private emitPlayerProgressUpdated;
    private emitGameEnded;
}
//# sourceMappingURL=rooms.service.d.ts.map