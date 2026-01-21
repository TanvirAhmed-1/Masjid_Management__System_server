export type Doner = {
  serialNumber: string;
  name: string;
  iftarDate: Date | string;
  dayName: string;
};

export interface IfterListInterface {
  id?: string;
  ramadanyearId: string;
  mosqueId: string;
  userId: string;
  doners: Doner[];
  createdAt?: Date;
  updatedAt?: Date;
}
