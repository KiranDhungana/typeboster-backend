import type { Server, Socket } from "socket.io";
import type { RoomsService } from "../modules/rooms/rooms.service";
import type { Room } from "../modules/rooms/rooms.types";
import type { RoomsEventsPublisher } from "../modules/rooms/rooms.repository";
import { ApiError } from "../common/errors/ApiError";

interface GameEventBase {
  type: string;
}

interface JoinRoomEvent extends GameEventBase {
  type: "join_room";
  roomId: string;
  playerId: string;
}

interface PlayerProgressEvent extends GameEventBase {
  type: "player_progress";
  roomId: string;
  playerId: string;
  progress: number;
}

type GameEvent = JoinRoomEvent | PlayerProgressEvent;

function toRoomUpdatedPayload(room: Room) {
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

export function createRoomsEventsPublisher(io: Server): RoomsEventsPublisher {
  return {
    roomUpdated(room: Room) {
      io.to(room.roomId).emit("room_updated", toRoomUpdatedPayload(room));
    },
    gameStarted(room: Room) {
      io.to(room.roomId).emit("game_started", {
        roomId: room.roomId,
        status: "in_progress",
      });
    },
    playerProgressUpdated(roomId: string, playerId: string, progress: number) {
      io.to(roomId).emit("player_progress", {
        roomId,
        playerId,
        progress,
      });
    },
    gameEnded(room: Room) {
      io.to(room.roomId).emit("game_ended", {
        roomId: room.roomId,
        status: "finished",
      });
    },
  };
}

export function registerRoomsGateway(io: Server, roomsService: RoomsService) {
  io.on("connection", (socket: Socket) => {
    socket.on("game_event", async (payload: GameEvent) => {
      try {
        if (!payload || typeof payload !== "object") {
          throw new ApiError(400, "VALIDATION_ERROR", "Invalid game_event payload");
        }

        switch (payload.type) {
          case "join_room":
            await handleJoinRoom(io, socket, roomsService, payload);
            break;
          case "player_progress":
            await handlePlayerProgress(io, roomsService, payload);
            break;
          default:
            throw new ApiError(400, "VALIDATION_ERROR", "Unknown game_event type");
        }
      } catch (err) {
        handleSocketError(socket, err);
      }
    });
  });
}

async function handleJoinRoom(
  io: Server,
  socket: Socket,
  roomsService: RoomsService,
  payload: JoinRoomEvent,
) {
  const room = roomsService.getRoom(payload.roomId);
  if (!room) {
    throw new ApiError(404, "ROOM_NOT_FOUND", "Room does not exist");
  }

  const player = room.players.find((p) => p.playerId === payload.playerId);
  if (!player) {
    throw new ApiError(404, "ROOM_NOT_FOUND", "Player not found in this room");
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

async function handlePlayerProgress(
  _io: Server,
  roomsService: RoomsService,
  payload: PlayerProgressEvent,
) {
  roomsService.updatePlayerProgress(payload.roomId, payload.playerId, payload.progress);
}

function handleSocketError(socket: Socket, err: unknown) {
  if (err instanceof ApiError) {
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

