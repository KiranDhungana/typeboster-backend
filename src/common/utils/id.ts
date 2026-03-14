import { customAlphabet } from "nanoid";

// Simple, human-friendly IDs (no confusing characters)
const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PLAYER_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

const createRoomId = customAlphabet(ROOM_ALPHABET, 6);
const createPlayerId = customAlphabet(PLAYER_ALPHABET, 10);

export function generateRoomId() {
  return createRoomId();
}

export function generatePlayerId() {
  return createPlayerId();
}

