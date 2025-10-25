// src/types/index.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: "SUPER_ADMIN" | "ADMIN" | "USER" | "MEMBER";
      name: string;
    };
  }
}
