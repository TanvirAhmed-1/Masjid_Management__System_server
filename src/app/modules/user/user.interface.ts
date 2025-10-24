import { GenderType, RoleType } from "@prisma/client";

export type Tuser = {
  _id?: string;  
  name: string;
  email: string;
  address: string;
  password: string;
  role?: RoleType;
  gender: GenderType;
  createdAt?: Date;
  updatedAt?: Date;
};
