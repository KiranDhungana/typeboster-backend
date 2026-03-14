import { z } from "zod";

export const createRoomSchema = z.object({
  hostName: z.string().min(1),
  maxPlayers: z.number().int().min(1).max(8).optional().default(4),
  durationSeconds: z.number().int().positive().optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomParamsSchema = z.object({
  roomId: z.string().min(1),
});

export const joinRoomBodySchema = z.object({
  playerName: z.string().min(1),
});

export type JoinRoomParams = z.infer<typeof joinRoomParamsSchema>;
export type JoinRoomBody = z.infer<typeof joinRoomBodySchema>;

export const startGameParamsSchema = z.object({
  roomId: z.string().min(1),
});

export const startGameBodySchema = z.object({
  playerId: z.string().min(1),
});

export type StartGameParams = z.infer<typeof startGameParamsSchema>;
export type StartGameBody = z.infer<typeof startGameBodySchema>;

