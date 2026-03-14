"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootRouter = createRootRouter;
const express_1 = require("express");
const rooms_routes_1 = require("./modules/rooms/rooms.routes");
function createRootRouter(roomsService) {
    const router = (0, express_1.Router)();
    router.use("/rooms", (0, rooms_routes_1.createRoomsRouter)(roomsService));
    return router;
}
//# sourceMappingURL=routes.js.map