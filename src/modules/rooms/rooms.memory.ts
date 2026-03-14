import type { Room } from "./rooms.types";
import type { RoomsRepository } from "./rooms.repository";

export class InMemoryRoomsRepository implements RoomsRepository {
  private readonly rooms = new Map<string, Room>();

  createRoom(room: Room): Room {
    this.rooms.set(room.roomId, room);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  saveRoom(room: Room): Room {
    this.rooms.set(room.roomId, room);
    return room;
  }

  deleteRoom(roomId: string): void {
    this.rooms.delete(roomId);
  }

  listRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

