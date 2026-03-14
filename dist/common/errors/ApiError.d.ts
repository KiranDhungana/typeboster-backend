export type ApiErrorCode = "ROOM_NOT_FOUND" | "ROOM_FULL" | "GAME_ALREADY_STARTED" | "NOT_HOST" | "NOT_ENOUGH_PLAYERS" | "VALIDATION_ERROR" | "INTERNAL_SERVER_ERROR";
export declare class ApiError extends Error {
    readonly status: number;
    readonly code: ApiErrorCode;
    readonly details?: unknown;
    constructor(status: number, code: ApiErrorCode, message: string, details?: unknown);
}
//# sourceMappingURL=ApiError.d.ts.map