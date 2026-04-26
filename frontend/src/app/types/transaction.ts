import { TransactionType } from './category';

export type Transaction = {
  id: string;
  date: Date;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
};
