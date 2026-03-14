"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const errorMiddleware_1 = require("./common/errors/errorMiddleware");
const rooms_memory_1 = require("./modules/rooms/rooms.memory");
const rooms_service_1 = require("./modules/rooms/rooms.service");
const routes_1 = require("./routes");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGINS,
        credentials: true,
    }));
    app.use(express_1.default.json());
    const roomsRepository = new rooms_memory_1.InMemoryRoomsRepository();
    const roomsService = new rooms_service_1.RoomsService(roomsRepository);
    app.use("/api", (0, routes_1.createRootRouter)(roomsService));
    app.use(errorMiddleware_1.errorMiddleware);
    return { app, roomsService };
}
//# sourceMappingURL=app.js.map