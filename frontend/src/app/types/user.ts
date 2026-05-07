export type UserStatus = 1 | 2;

export type User = {
  id: number;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  createdAt: Date;
};
