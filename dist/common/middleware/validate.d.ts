import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
type Schema = ZodType;
export declare function validate(schema: Schema, property?: "body" | "params" | "query"): (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.d.ts.map