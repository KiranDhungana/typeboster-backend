"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load `.env` from the project root (one level above `src`)
dotenv_1.default.config({
    path: node_path_1.default.resolve(__dirname, "..", "..", ".env"),
});
const NODE_ENV = process.env.NODE_ENV ?? "development";
const defaultPort = NODE_ENV === "production" ? 5004 : 4000;
const PORT = process.env.PORT ? Number(process.env.PORT) : defaultPort;
exports.env = {
    PORT,
    NODE_ENV,
    CORS_ORIGINS: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
};
//# sourceMappingURL=env.js.map