import axios from 'axios';
import type {
  CreateTransactionRequestBody,
  GetTransactionResponse,
  Transaction,
  TransactionDetail,
  TransactionSummary,
  UpdateTransactionDTO,
} from '../types/api';

export async function getTransaction(transactionId: number, token: string) {
  const response = await axios.get<GetTransactionResponse>(
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
  const response = await axios.post<TransactionSummary>(
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

export async function deleteTransaction(transactionId: number, token: string) {
  const response = await axios.delete<string>(
    `http://localhost:5217/api/v1/Transactions/${transactionId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function getAllTransactionDetails() {
  const response = await axios.get<TransactionDetail[]>(
    'http://localhost:5217/api/v1/Transactions/details'
  );
  return response;
}

export async function updateTransaction(
  transactionId: number,
  reqBody: Partial<UpdateTransactionDTO>,
  token: string
) {
  const response = await axios.put<string>(
    `http://localhost:5217/api/v1/Transactions/${transactionId}/edit`,
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
