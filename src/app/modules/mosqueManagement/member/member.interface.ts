 export interface ICreateMemberInput {
  name: string;
  mosqueId?: string;
  email: string;
  phone: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
  password: string;
}