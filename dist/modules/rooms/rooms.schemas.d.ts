import { z } from "zod";
export declare const createRoomSchema: z.ZodObject<{
    hostName: z.ZodString;
    maxPlayers: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export declare const joinRoomParamsSchema: z.ZodObject<{
    roomId: z.ZodString;
}, z.core.$strip>;
export declare const joinRoomBodySchema: z.ZodObject<{
    playerName: z.ZodString;
}, z.core.$strip>;
export type JoinRoomParams = z.infer<typeof joinRoomParamsSchema>;
export type JoinRoomBody = z.infer<typeof joinRoomBodySchema>;
export declare const startGameParamsSchema: z.ZodObject<{
    roomId: z.ZodString;
}, z.core.$strip>;
export declare const startGameBodySchema: z.ZodObject<{
    playerId: z.ZodString;
}, z.core.$strip>;
export type StartGameParams = z.infer<typeof startGameParamsSchema>;
export type StartGameBody = z.infer<typeof startGameBodySchema>;
//# sourceMappingURL=rooms.schemas.d.ts.map