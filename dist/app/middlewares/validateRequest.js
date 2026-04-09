"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const validateRequest = (schemaObj: ZodSchema) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schemaObj.parseAsync(req.body);
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };
// export default validateRequest;
const validateRequest = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            yield schema.parseAsync(req.body); // direct body validation
            next();
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: ((_b = (_a = err.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) || "Validation error",
            });
        }
    });
};
exports.default = validateRequest;
