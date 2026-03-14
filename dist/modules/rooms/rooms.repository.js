"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlayerInRoom = updatePlayerInRoom;
exports.changeRoomStatus = changeRoomStatus;
function updatePlayerInRoom(room, playerId, updater) {
    const players = room.players.map((p) => (p.playerId === playerId ? updater(p) : p));
    return { ...room, players };
}
function changeRoomStatus(room, status) {
    return { ...room, status };
}
//# sourceMappingURL=rooms.repository.js.map