"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRoomsRepository = void 0;
class InMemoryRoomsRepository {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(room) {
        this.rooms.set(room.roomId, room);
        return room;
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    saveRoom(room) {
        this.rooms.set(room.roomId, room);
        return room;
    }
    deleteRoom(roomId) {
        this.rooms.delete(roomId);
    }
    listRooms() {
        return Array.from(this.rooms.values());
    }
}
exports.InMemoryRoomsRepository = InMemoryRoomsRepository;
//# sourceMappingURL=rooms.memory.js.map