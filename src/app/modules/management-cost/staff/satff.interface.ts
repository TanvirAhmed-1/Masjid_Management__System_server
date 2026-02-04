export interface IStaff {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  image?: string;
  role: string;
  baseSalary: number;
  joinDate?: Date;
  active?: boolean;
  mosqueId?: string;
}
