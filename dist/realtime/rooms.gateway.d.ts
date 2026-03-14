import type { Server } from "socket.io";
import type { RoomsService } from "../modules/rooms/rooms.service";
import type { RoomsEventsPublisher } from "../modules/rooms/rooms.repository";
export declare function createRoomsEventsPublisher(io: Server): RoomsEventsPublisher;
export declare function registerRoomsGateway(io: Server, roomsService: RoomsService): void;
//# sourceMappingURL=rooms.gateway.d.ts.map