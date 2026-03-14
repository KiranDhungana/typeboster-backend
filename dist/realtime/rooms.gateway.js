"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomsEventsPublisher = createRoomsEventsPublisher;
exports.registerRoomsGateway = registerRoomsGateway;
const ApiError_1 = require("../common/errors/ApiError");
function toRoomUpdatedPayload(room) {
    return {
        roomId: room.roomId,
        hostId: room.hostId,
        players: room.players.map((p) => ({
            playerId: p.playerId,
            name: p.name,
            joinedAt: p.joinedAt,
            progress: p.progress,
        })),
        status: room.status,
        durationSeconds: room.durationSeconds || undefined,
    };
}
function createRoomsEventsPublisher(io) {
    return {
        roomUpdated(room) {
            io.to(room.roomId).emit("room_updated", toRoomUpdatedPayload(room));
        },
        gameStarted(room) {
            io.to(room.roomId).emit("game_started", {
                roomId: room.roomId,
                status: "in_progress",
            });
        },
        playerProgressUpdated(roomId, playerId, progress) {
            io.to(roomId).emit("player_progress", {
                roomId,
                playerId,
                progress,
            });
        },
        gameEnded(room) {
            io.to(room.roomId).emit("game_ended", {
                roomId: room.roomId,
                status: "finished",
            });
        },
    };
}
function registerRoomsGateway(io, roomsService) {
    io.on("connection", (socket) => {
        socket.on("game_event", async (payload) => {
            try {
                if (!payload || typeof payload !== "object") {
                    throw new ApiError_1.ApiError(400, "VALIDATION_ERROR", "Invalid game_event payload");
                }
                switch (payload.type) {
                    case "join_room":
                        await handleJoinRoom(io, socket, roomsService, payload);
                        break;
                    case "player_progress":
                        await handlePlayerProgress(io, roomsService, payload);
                        break;
                    default:
                        throw new ApiError_1.ApiError(400, "VALIDATION_ERROR", "Unknown game_event type");
                }
            }
            catch (err) {
                handleSocketError(socket, err);
            }
        });
    });
}
async function handleJoinRoom(io, socket, roomsService, payload) {
    const room = roomsService.getRoom(payload.roomId);
    if (!room) {
        throw new ApiError_1.ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
    }
    const player = room.players.find((p) => p.playerId === payload.playerId);
    if (!player) {
        throw new ApiError_1.ApiError(404, "ROOM_NOT_FOUND", "Player not found in this room");
    }
    await socket.join(room.roomId);
    // Optionally confirm to the joining client
    socket.emit("room_joined", {
        roomId: room.roomId,
        playerId: player.playerId,
    });
    // Broadcast updated room state
    io.to(room.roomId).emit("room_updated", toRoomUpdatedPayload(room));
}
async function handlePlayerProgress(_io, roomsService, payload) {
    roomsService.updatePlayerProgress(payload.roomId, payload.playerId, payload.progress);
}
function handleSocketError(socket, err) {
    if (err instanceof ApiError_1.ApiError) {
        socket.emit("error", {
            error: {
                code: err.code,
                message: err.message,
            },
        });
        return;
    }
    console.error("[SocketError]", err);
    socket.emit("error", {
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        },
    });
}
//# sourceMappingURL=rooms.gateway.js.map