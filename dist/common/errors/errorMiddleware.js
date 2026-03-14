"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const zod_1 = require("zod");
const ApiError_1 = require("./ApiError");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                ...(err.details ? { details: err.details } : {}),
            },
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Request validation failed",
                details: err.flatten(),
            },
        });
    }
    console.error("[UnhandledError]", err);
    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        },
    });
}
//# sourceMappingURL=errorMiddleware.js.map