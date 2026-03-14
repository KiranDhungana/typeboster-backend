"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameBodySchema = exports.startGameParamsSchema = exports.joinRoomBodySchema = exports.joinRoomParamsSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
exports.createRoomSchema = zod_1.z.object({
    hostName: zod_1.z.string().min(1),
    maxPlayers: zod_1.z.number().int().min(1).max(8).optional().default(4),
    durationSeconds: zod_1.z.number().int().positive().optional(),
});
exports.joinRoomParamsSchema = zod_1.z.object({
    roomId: zod_1.z.string().min(1),
});
exports.joinRoomBodySchema = zod_1.z.object({
    playerName: zod_1.z.string().min(1),
});
exports.startGameParamsSchema = zod_1.z.object({
    roomId: zod_1.z.string().min(1),
});
exports.startGameBodySchema = zod_1.z.object({
    playerId: zod_1.z.string().min(1),
});
//# sourceMappingURL=rooms.schemas.js.map