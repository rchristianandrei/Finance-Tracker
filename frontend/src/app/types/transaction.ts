export type TransactionType = 'EXPENSE' | 'INCOME';

export type Transaction = {
  id: string;
  date: Date;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
};
