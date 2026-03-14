"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const app_1 = require("./app");
const realtime_1 = require("./realtime");
const { app, roomsService } = (0, app_1.createApp)();
const server = http_1.default.createServer(app);
(0, realtime_1.initializeRealtime)(server, roomsService);
server.listen(env_1.env.PORT, () => {
    console.log(`TypeBoster backend listening on port ${env_1.env.PORT} (${env_1.env.NODE_ENV})`);
});
//# sourceMappingURL=main.js.map