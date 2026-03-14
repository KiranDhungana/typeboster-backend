import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";
import type { RoomsService } from "../modules/rooms/rooms.service";
import { createRoomsEventsPublisher, registerRoomsGateway } from "./rooms.gateway";

export function initializeRealtime(server: HttpServer, roomsService: RoomsService) {
  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGINS,
      methods: ["GET", "POST"],
    },
  });

  // Wire Socket.IO publisher into RoomsService so HTTP flows also emit events
  const publisher = createRoomsEventsPublisher(io);
  roomsService.setEventsPublisher(publisher);

  registerRoomsGateway(io, roomsService);

  return io;
}

