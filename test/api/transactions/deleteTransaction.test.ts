import axios, { AxiosError } from 'axios';
import { CreateTransactionRequestBody, Transaction } from '../../../types/api';

const deleteTransaction = async (groupId: number) => {
  const response = await axios.delete<Transaction>(
    `http://localhost:5217/api/v1/Transactions/${groupId}/delete`
  );
  return response;
};

const createTransaction = async (body: CreateTransactionRequestBody) => {
  const response = await axios.post<Transaction>(
    `http://localhost:5217/api/v1/Transactions/add`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response;
};

const createTransactionBody: CreateTransactionRequestBody = {
  Transaction: {
    createdBy: 1,
    payerId: 1,
    amount: 100,
    groupId: 1,
  },
  TransactionDetailsPartial: [
    {
      transactionId: 1,
      payerId: 1,
      recipientId: 2,
      groupId: 1,
      amount: 50,
    },
    {
      transactionId: 1,
      payerId: 1,
      recipientId: 1,
      groupId: 1,
      amount: 50,
    },
  ],
};

describe('Deleting a transaction', () => {
  it('should return a successful response code on a valid request', async () => {
    const transactionToBeDeleted = await createTransaction(
      createTransactionBody
    );
    const response = await deleteTransaction(transactionToBeDeleted.data.id);
    expect(response.status).toBe(200);
  });

  it('should return the deleted transaction on a valid request', async () => {
    const { data: transactionToBeDeleted } = await createTransaction(
      createTransactionBody
    );
    const { data: deletedTransaction } = await deleteTransaction(
      transactionToBeDeleted.id
    );

    expect(deletedTransaction.id).toBe(transactionToBeDeleted.id);
    expect(deletedTransaction.createdBy).toBe(transactionToBeDeleted.createdBy);
    expect(deletedTransaction.payerId).toBe(transactionToBeDeleted.payerId);
    expect(deletedTransaction.groupId).toBe(transactionToBeDeleted.groupId);
    expect(deletedTransaction.amount).toBe(transactionToBeDeleted.amount);
    expect(deletedTransaction.createdAt).toBe(transactionToBeDeleted.createdAt);
  });
  it('should return a 404 response code if the transaction does not exist', async () => {
    let isError = false;
    try {
      await deleteTransaction(100000);
    } catch (error) {
      isError = true;
      expect((error as AxiosError).response?.status).toBe(404);
    }
    expect(isError).toBe(true);
  });
  it('should return a 400 response code if the transaction id is not a number', async () => {
    let isError = false;
    try {
      await deleteTransaction(NaN);
    } catch (error) {
      isError = true;
      expect((error as AxiosError).response?.status).toBe(400);
    }
    expect(isError).toBe(true);
  });
  it('should return a 400 response code if the transaction id is a string', async () => {
    let isError = false;
    try {
      // invalid input type intentionally for testing error response
      await deleteTransaction('string' as unknown as number);
    } catch (error) {
      isError = true;
      expect((error as AxiosError).response?.status).toBe(400);
    }
    expect(isError).toBe(true);
  });
  it('should delete the transaction from the database', async () => {
    const transactionToBeDeleted = await createTransaction(
      createTransactionBody
    );
    await deleteTransaction(transactionToBeDeleted.data.id);
    let isError = false;
    try {
      await axios.get(
        `http://localhost:5217/api/v1/Transactions/${transactionToBeDeleted.data.id}`
      );
    } catch (error) {
      isError = true;
      expect((error as AxiosError).response?.status).toBe(404);
      expect((error as AxiosError).response?.data).toEqual(
        `Transaction not found: ${transactionToBeDeleted.data.id}`
      );
    }
    expect(isError).toBe(true);
  });
  it('database should have one less transaction after deleting a transaction', async () => {
    const currentTransactions = await axios.get(
      `http://localhost:5217/api/v1/Transactions`
    );

    const transactionToBeDeleted = await createTransaction(
      createTransactionBody
    );
    await deleteTransaction(transactionToBeDeleted.data.id);
    const transactionsAfterDeletion = await axios.get(
      `http://localhost:5217/api/v1/Transactions`
    );

    expect(transactionsAfterDeletion.data.length).toBe(
      currentTransactions.data.length
    );
  });

  it('database should be equal after creating then deleting the created transaction', async () => {
    const currentTransactions = await axios.get(
      `http://localhost:5217/api/v1/Transactions`
    );

    const transactionToBeDeleted = await createTransaction(
      createTransactionBody
    );
    await deleteTransaction(transactionToBeDeleted.data.id);
    const transactionsAfterDeletion = await axios.get(
      `http://localhost:5217/api/v1/Transactions`
    );

    expect(transactionsAfterDeletion.data).toStrictEqual(
      currentTransactions.data
    );
  });

  it('should delete the corresponding transaction details from the database', async () => {
    const transactionToBeDeleted = await createTransaction(
      createTransactionBody
    );
    await deleteTransaction(transactionToBeDeleted.data.id);
    let isError = false;
    // get all transactions and loop through them to check if the transaction details are deleted
    const { data: transactions } = await axios.get<Transaction[]>(
      `http://localhost:5217/api/v1/Transactions`
    );
    transactions.forEach((transaction) => {
      const transactionDetails = transaction.transactionDetails;
      transactionDetails!.forEach((transactionDetail) => {
        if (
          transactionDetail.transactionId === transactionToBeDeleted.data.id
        ) {
          isError = true;
        }
      });
    });
    expect(isError).toBe(false);
  });

  it('delete the correct amount of transactions', async () => {
    const currentTransactions = await axios.get(
      `http://localhost:5217/api/v1/Transactions`
    );

    for (let i = 0; i < 25; i++) {
      const newTransaction = await createTransaction(createTransactionBody);
      await deleteTransaction(newTransaction.data.id);
    }

    const transactionsAfterDeletion = await axios.get(
      `http://localhost:5217/api/v1/Transactions`
    );

    expect(transactionsAfterDeletion.data.length).toBe(
      currentTransactions.data.length
    );
  });
});
