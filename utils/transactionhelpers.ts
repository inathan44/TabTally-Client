import axios, { AxiosError } from 'axios';
import type { CreateTransactionRequestBody, Transaction } from '../types/api';

export async function getTransaction(transactionId: string, token: string) {
  const response = await axios.get<Transaction>(
    `http://localhost:5217/api/v1/Transactions/${transactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function createTransaction(
  reqBody: CreateTransactionRequestBody,
  token: string
) {
  const response = await axios.post<Transaction>(
    'http://localhost:5217/api/v1/Transactions/add',
    reqBody,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function getTransactions() {
  const response = await axios.get<Transaction[]>(
    'http://localhost:5217/api/v1/Transactions'
  );
  return response;
}

export async function deleteTransaction(groupId: number, token: string) {
  const response = await axios.delete<Transaction>(
    `http://localhost:5217/api/v1/Transactions/${groupId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}
