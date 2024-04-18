export type Transaction = {
  id: number;
  createdBy: number;
  payerId: number;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  groupId: number;
  user?: User;
  payer?: User;
  group?: Group;
  transactionDetails?: TransactionDetail[];
};

export type TransactionDetail = {
  id: number;
  transactionId: number;
  payerId: number;
  recipientId: number;
  groupId: number;
  amount: number;
  transaction?: Transaction;
  payer?: User;
  recipient?: User;
  group?: Group;
};

export type Group = {
  id: number;
  name: string;
  createdBy: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  createdAt: string;
};

export type CreateTransactionRequestBody = {
  Transaction: Partial<Transaction>;
  TransactionDetailsPartial: Partial<TransactionDetail>[];
};
