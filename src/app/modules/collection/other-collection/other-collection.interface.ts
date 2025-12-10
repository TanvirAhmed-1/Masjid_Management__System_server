export type Donor = {
  name: string;
  amount: number;
};

export type IOtherCollection = {
  id?: string;
  donors: Donor[];
  otherCollectionNameId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
