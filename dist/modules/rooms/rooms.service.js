"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const ApiError_1 = require("../../common/errors/ApiError");
const id_1 = require("../../common/utils/id");
const rooms_repository_1 = require("./rooms.repository");
class RoomsService {
    constructor(repo) {
        this.repo = repo;
        this.roomTimers = new Map();
    }
    setEventsPublisher(publisher) {
        this.eventsPublisher = publisher;
    }
    createRoom(hostName, maxPlayers = 4, durationSeconds) {
        const roomId = (0, id_1.generateRoomId)();
        const hostId = (0, id_1.generatePlayerId)();
        const now = new Date().toISOString();
        const host = {
            playerId: hostId,
            name: hostName,
            joinedAt: now,
            progress: 0,
        };
        const room = {
            roomId,
            hostId,
            maxPlayers: maxPlayers ?? 4,
            players: [host],
            status: "waiting",
            durationSeconds: durationSeconds ?? 0,
        };
        this.repo.createRoom(room);
        this.emitRoomUpdated(room);
        return { roomId, hostId, maxPlayers: room.maxPlayers, durationSeconds: room.durationSeconds || undefined };
    }
    joinRoom(roomIdRaw, playerName) {
        const roomId = roomIdRaw.trim();
        const room = this.repo.getRoom(roomId);
        if (!room) {
            throw new ApiError_1.ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
        }
        if (room.status !== "waiting") {
            throw new ApiError_1.ApiError(409, "GAME_ALREADY_STARTED", "Game has already started for this room");
        }
        if (room.players.length >= room.maxPlayers) {
            throw new ApiError_1.ApiError(409, "ROOM_FULL", "Room is already full");
        }
        const playerId = (0, id_1.generatePlayerId)();
        const now = new Date().toISOString();
        const player = {
            playerId,
            name: playerName,
            joinedAt: now,
            progress: 0,
        };
        const updatedRoom = {
            ...room,
            players: [...room.players, player],
        };
        this.repo.saveRoom(updatedRoom);
        this.emitRoomUpdated(updatedRoom);
        return {
            roomId: updatedRoom.roomId,
            playerId,
            players: updatedRoom.players,
        };
    }
    startGame(roomIdRaw, playerId) {
        const roomId = roomIdRaw.trim();
        const room = this.repo.getRoom(roomId);
        if (!room) {
            throw new ApiError_1.ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
        }
        if (room.hostId !== playerId) {
            throw new ApiError_1.ApiError(403, "NOT_HOST", "Only the host can start the game");
        }
        if (room.players.length < 2) {
            throw new ApiError_1.ApiError(400, "NOT_ENOUGH_PLAYERS", "At least two players are required to start the game");
        }
        if (room.status !== "waiting") {
            throw new ApiError_1.ApiError(409, "GAME_ALREADY_STARTED", "Game has already started for this room");
        }
        const updatedRoom = (0, rooms_repository_1.changeRoomStatus)(room, "in_progress");
        this.repo.saveRoom(updatedRoom);
        this.emitGameStarted(updatedRoom);
        this.emitRoomUpdated(updatedRoom);
        this.startRoomTimer(updatedRoom);
    }
    updatePlayerProgress(roomIdRaw, playerId, progress) {
        const roomId = roomIdRaw.trim();
        const room = this.repo.getRoom(roomId);
        if (!room) {
            throw new ApiError_1.ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
        }
        const hasPlayer = room.players.some((p) => p.playerId === playerId);
        if (!hasPlayer) {
            throw new ApiError_1.ApiError(404, "ROOM_NOT_FOUND", "Player not found in this room");
        }
        const updatedRoom = (0, rooms_repository_1.updatePlayerInRoom)(room, playerId, (player) => ({
            ...player,
            progress,
        }));
        this.repo.saveRoom(updatedRoom);
        this.emitPlayerProgressUpdated(updatedRoom.roomId, playerId, progress);
        this.emitRoomUpdated(updatedRoom);
        return updatedRoom;
    }
    getRoom(roomIdRaw) {
        const roomId = roomIdRaw.trim();
        return this.repo.getRoom(roomId);
    }
    startRoomTimer(room) {
        const durationSeconds = room.durationSeconds;
        if (!durationSeconds || durationSeconds <= 0) {
            return;
        }
        const existingTimer = this.roomTimers.get(room.roomId);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }
        const timeout = setTimeout(() => {
            const currentRoom = this.repo.getRoom(room.roomId);
            if (!currentRoom || currentRoom.status === "finished") {
                return;
            }
            const finishedRoom = (0, rooms_repository_1.changeRoomStatus)(currentRoom, "finished");
            this.repo.saveRoom(finishedRoom);
            this.emitGameEnded(finishedRoom);
            this.emitRoomUpdated(finishedRoom);
            this.roomTimers.delete(room.roomId);
        }, durationSeconds * 1000);
        this.roomTimers.set(room.roomId, timeout);
    }
    emitRoomUpdated(room) {
        this.eventsPublisher?.roomUpdated(room);
    }
    emitGameStarted(room) {
        this.eventsPublisher?.gameStarted(room);
    }
    emitPlayerProgressUpdated(roomId, playerId, progress) {
        this.eventsPublisher?.playerProgressUpdated(roomId, playerId, progress);
    }
    emitGameEnded(room) {
        this.eventsPublisher?.gameEnded(room);
    }
}
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map