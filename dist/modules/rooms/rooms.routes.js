"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomsRouter = createRoomsRouter;
const express_1 = require("express");
const validate_1 = require("../../common/middleware/validate");
const rooms_schemas_1 = require("./rooms.schemas");
const rooms_controller_1 = require("./rooms.controller");
function createRoomsRouter(roomsService) {
    const router = (0, express_1.Router)();
    const controller = new rooms_controller_1.RoomsController(roomsService);
    router.post("/", (0, validate_1.validate)(rooms_schemas_1.createRoomSchema, "body"), controller.createRoom);
    router.post("/:roomId/join", (0, validate_1.validate)(rooms_schemas_1.joinRoomParamsSchema, "params"), (0, validate_1.validate)(rooms_schemas_1.joinRoomBodySchema, "body"), controller.joinRoom);
    router.post("/:roomId/start", (0, validate_1.validate)(rooms_schemas_1.startGameParamsSchema, "params"), (0, validate_1.validate)(rooms_schemas_1.startGameBodySchema, "body"), controller.startGame);
    return router;
}
//# sourceMappingURL=rooms.routes.js.map