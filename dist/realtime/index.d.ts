import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import type { RoomsService } from "../modules/rooms/rooms.service";
export declare function initializeRealtime(server: HttpServer, roomsService: RoomsService): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
//# sourceMappingURL=index.d.ts.map