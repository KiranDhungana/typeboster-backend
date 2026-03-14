import { ApiError } from "../../common/errors/ApiError";
import { generatePlayerId, generateRoomId } from "../../common/utils/id";
import type { RoomsEventsPublisher, RoomsRepository } from "./rooms.repository";
import { changeRoomStatus, updatePlayerInRoom } from "./rooms.repository";
import type { Player, Room } from "./rooms.types";

export class RoomsService {
  private eventsPublisher?: RoomsEventsPublisher;
  private roomTimers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly repo: RoomsRepository) {}

  setEventsPublisher(publisher: RoomsEventsPublisher) {
    this.eventsPublisher = publisher;
  }

  createRoom(
    hostName: string,
    maxPlayers: number = 4,
    durationSeconds?: number,
  ): { roomId: string; hostId: string; maxPlayers: number; durationSeconds: number | undefined } {
    const roomId = generateRoomId();
    const hostId = generatePlayerId();
    const now = new Date().toISOString();

    const host: Player = {
      playerId: hostId,
      name: hostName,
      joinedAt: now,
      progress: 0,
    };

    const room: Room = {
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

  joinRoom(roomIdRaw: string, playerName: string) {
    const roomId = roomIdRaw.trim();
    const room = this.repo.getRoom(roomId);
    if (!room) {
      throw new ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
    }
    if (room.status !== "waiting") {
      throw new ApiError(409, "GAME_ALREADY_STARTED", "Game has already started for this room");
    }
    if (room.players.length >= room.maxPlayers) {
      throw new ApiError(409, "ROOM_FULL", "Room is already full");
    }

    const playerId = generatePlayerId();
    const now = new Date().toISOString();

    const player: Player = {
      playerId,
      name: playerName,
      joinedAt: now,
      progress: 0,
    };

    const updatedRoom: Room = {
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

  startGame(roomIdRaw: string, playerId: string): void {
    const roomId = roomIdRaw.trim();
    const room = this.repo.getRoom(roomId);
    if (!room) {
      throw new ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
    }
    if (room.hostId !== playerId) {
      throw new ApiError(403, "NOT_HOST", "Only the host can start the game");
    }
    if (room.players.length < 2) {
      throw new ApiError(400, "NOT_ENOUGH_PLAYERS", "At least two players are required to start the game");
    }
    if (room.status !== "waiting") {
      throw new ApiError(409, "GAME_ALREADY_STARTED", "Game has already started for this room");
    }

    const updatedRoom = changeRoomStatus(room, "in_progress");
    this.repo.saveRoom(updatedRoom);

    this.emitGameStarted(updatedRoom);
    this.emitRoomUpdated(updatedRoom);

    this.startRoomTimer(updatedRoom);
  }

  updatePlayerProgress(roomIdRaw: string, playerId: string, progress: number): Room {
    const roomId = roomIdRaw.trim();
    const room = this.repo.getRoom(roomId);
    if (!room) {
      throw new ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
    }

    const hasPlayer = room.players.some((p) => p.playerId === playerId);
    if (!hasPlayer) {
      throw new ApiError(404, "ROOM_NOT_FOUND", "Player not found in this room");
    }

    const updatedRoom = updatePlayerInRoom(room, playerId, (player) => ({
      ...player,
      progress,
    }));

    this.repo.saveRoom(updatedRoom);
    this.emitPlayerProgressUpdated(updatedRoom.roomId, playerId, progress);
    this.emitRoomUpdated(updatedRoom);

    return updatedRoom;
  }

  getRoom(roomIdRaw: string): Room | undefined {
    const roomId = roomIdRaw.trim();
    return this.repo.getRoom(roomId);
  }

  private startRoomTimer(room: Room) {
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

      const finishedRoom = changeRoomStatus(currentRoom, "finished");
      this.repo.saveRoom(finishedRoom);

      this.emitGameEnded(finishedRoom);
      this.emitRoomUpdated(finishedRoom);
      this.roomTimers.delete(room.roomId);
    }, durationSeconds * 1000);

    this.roomTimers.set(room.roomId, timeout);
  }

  private emitRoomUpdated(room: Room) {
    this.eventsPublisher?.roomUpdated(room);
  }

  private emitGameStarted(room: Room) {
    this.eventsPublisher?.gameStarted(room);
  }

  private emitPlayerProgressUpdated(roomId: string, playerId: string, progress: number) {
    this.eventsPublisher?.playerProgressUpdated(roomId, playerId, progress);
  }

  private emitGameEnded(room: Room) {
    this.eventsPublisher?.gameEnded(room);
  }
}

