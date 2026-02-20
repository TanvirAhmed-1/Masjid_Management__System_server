export type CreateMosqueWithAdminInput = {
  mosque: {
    name: string;
    address: string;
    phone: string;
  };
  admin: {
    name: string;
    email: string;
    password: string;
    address: string;
    gender: "MALE" | "FEMALE" | "OTHERS";
    phone: string;
  };
};