"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema, property = "body") {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse(req[property]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req[property] = parsed;
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map