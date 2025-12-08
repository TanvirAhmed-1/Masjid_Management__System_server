export interface IMonthlySalary {
  id?: string;
  month: Date;
  staffId: string;
  totalSalary: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}