import type { Room } from "./rooms.types";
import type { RoomsRepository } from "./rooms.repository";
export declare class InMemoryRoomsRepository implements RoomsRepository {
    private readonly rooms;
    createRoom(room: Room): Room;
    getRoom(roomId: string): Room | undefined;
    saveRoom(room: Room): Room;
    deleteRoom(roomId: string): void;
    listRooms(): Room[];
}
//# sourceMappingURL=rooms.memory.d.ts.map