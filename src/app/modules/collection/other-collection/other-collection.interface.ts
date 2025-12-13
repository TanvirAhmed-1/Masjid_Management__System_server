export type Donor = {
  name: string;
  amount: number;
};

export type IOtherCollection = {
  id?: string;
  donors: Donor[];
  date: Date;
  otherCollectionNameId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
