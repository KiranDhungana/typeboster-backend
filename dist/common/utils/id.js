"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = generateRoomId;
exports.generatePlayerId = generatePlayerId;
const nanoid_1 = require("nanoid");
// Simple, human-friendly IDs (no confusing characters)
const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PLAYER_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const createRoomId = (0, nanoid_1.customAlphabet)(ROOM_ALPHABET, 6);
const createPlayerId = (0, nanoid_1.customAlphabet)(PLAYER_ALPHABET, 10);
function generateRoomId() {
    return createRoomId();
}
function generatePlayerId() {
    return createPlayerId();
}
//# sourceMappingURL=id.js.map