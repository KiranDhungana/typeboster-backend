import type { Player, Room, RoomStatus } from "./rooms.types";
export interface RoomsRepository {
    createRoom(room: Room): Room;
    getRoom(roomId: string): Room | undefined;
    saveRoom(room: Room): Room;
    deleteRoom(roomId: string): void;
    listRooms(): Room[];
}
export interface RoomsEventsPublisher {
    roomUpdated(room: Room): void;
    gameStarted(room: Room): void;
    playerProgressUpdated(roomId: string, playerId: string, progress: number): void;
    gameEnded(room: Room): void;
}
export declare function updatePlayerInRoom(room: Room, playerId: string, updater: (player: Player) => Player): Room;
export declare function changeRoomStatus(room: Room, status: RoomStatus): Room;
//# sourceMappingURL=rooms.repository.d.ts.map