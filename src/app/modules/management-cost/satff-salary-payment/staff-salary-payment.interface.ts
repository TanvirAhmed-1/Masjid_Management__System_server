export interface ISalaryPayment {
  id?: string;
  amount: number;
  payDate?: string; 
  salaryId: string;
  userId: string;
  createdAt?: Date;
}
