"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRealtime = initializeRealtime;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
const rooms_gateway_1 = require("./rooms.gateway");
function initializeRealtime(server, roomsService) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: env_1.env.CORS_ORIGINS,
            methods: ["GET", "POST"],
        },
    });
    // Wire Socket.IO publisher into RoomsService so HTTP flows also emit events
    const publisher = (0, rooms_gateway_1.createRoomsEventsPublisher)(io);
    roomsService.setEventsPublisher(publisher);
    (0, rooms_gateway_1.registerRoomsGateway)(io, roomsService);
    return io;
}
//# sourceMappingURL=index.js.map