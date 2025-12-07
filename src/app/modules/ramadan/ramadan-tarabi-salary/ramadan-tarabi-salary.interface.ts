// ramadan-iftar-salary.interface.ts

export interface IRamadanIftarSalary {
  id?: string;
  ramadanYear: string;
  totalSalary: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRamadanIftarSalaryPayment {
  id?: string;
  amount: number;
  payDate?: Date;
  salaryId: string;
  memberId: string;
  userId: string;
  createdAt?: Date;
}
