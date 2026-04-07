export type TransactionType = {
  id: string;
  date: Date;
  type: 'EXPENSE' | 'INCOME';
  category: string;
  description: string;
  amount: number;
};
