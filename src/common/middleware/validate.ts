import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type Schema = ZodType;

export function validate(schema: Schema, property: "body" | "params" | "query" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[property]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[property] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}

