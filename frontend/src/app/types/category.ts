export type TransactionType = 1 | 2;

export type Category = {
  id: number;
  name: string;
  type: TransactionType;
};
