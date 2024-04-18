import axios, { AxiosError } from 'axios';
import type {
  Transaction,
  TransactionDetail,
  CreateTransactionRequestBody,
} from '../../../types/api';

async function createTransaction(reqBody: CreateTransactionRequestBody) {
  const response = await axios.post<Transaction>(
    'http://localhost:5217/api/v1/Transactions/add',
    reqBody,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response;
}

const newTransaction: Partial<Transaction> = {
  amount: 100,
  createdBy: 1,
  payerId: 1,
  groupId: 1,
  description: 'Test Transaction',
};

const newTransactionDetails: Partial<TransactionDetail>[] = [
  {
    payerId: 1,
    recipientId: 2,
    groupId: 1,
    amount: 100,
  },
];

describe('creating a transaction', () => {
  it('should return a status code of 201', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: newTransactionDetails,
      });
      expect(response.status).toBe(201);
    } catch (error) {
      isError = true;
    }
    expect(isError).toBe(false);
  });

  it('should return a transaction object', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: newTransactionDetails,
      });
      expect(response.data).toBeDefined();
      // Has all of the necessary properties
      const transaction = response.data;
      expect(transaction).toBeDefined();
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('createdBy');
      expect(transaction).toHaveProperty('payerId');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('description');
      expect(transaction).toHaveProperty('createdAt');
      expect(transaction).toHaveProperty('updatedAt');
      expect(transaction).toHaveProperty('groupId');
      expect(transaction).toHaveProperty('transactionDetails');
      expect(transaction).toHaveProperty('user');
      expect(transaction).toHaveProperty('payer');
      expect(transaction).toHaveProperty('group');
    } catch (error) {
      isError = true;
    }
    expect(isError).toBe(false);
  });

  it('should create a transaction', async () => {
    let isError = false;
    try {
      const { data: allTransactions } = await axios.get<Transaction[]>(
        `http://localhost:5217/api/v1/Transactions`
      );

      // Sends the request to create a new transaction
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: newTransactionDetails,
      });

      const newTransactions = await axios.get<Transaction[]>(
        'http://localhost:5217/api/v1/Transactions'
      );
      expect(newTransactions.data.length).toBe(allTransactions.length + 1);

      // Responds with the correct amount of transaction details
      expect(response.data.transactionDetails?.length).toBe(1);
    } catch (error) {
      isError = true;
    }
    expect(isError).toBe(false);
  });

  // Handles validation errors
  it('should send a 400 status code if the transaction body is invalid', async () => {
    let isError = false;
    try {
      await axios.post<Transaction>(
        'http://localhost:5217/api/v1/Transactions/add',
        { amount: 100 }
      );
    } catch (error) {
      if (error instanceof Error) {
        isError = true;
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should send a 400 status code if the transaction detail amounts do not match the transaction amount', async () => {
    let isError = false;
    try {
      await axios.post<Transaction>(
        'http://localhost:5217/api/v1/Transactions/add',
        {
          transaction: newTransaction,
          transactionDetails: [
            {
              amount: 50,
              transactionId: 1,
              payerId: 1,
              recipientId: 2,
              groupId: 1,
            },
          ],
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        isError = true;
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should send a 400 status code if the transaction amount is negative', async () => {
    let isError = false;
    try {
      await axios.post<Transaction>(
        'http://localhost:5217/api/v1/Transactions/add',
        {
          transaction: { ...newTransaction, amount: -100 },
          TransactionDetailsPartial: newTransactionDetails,
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        isError = true;
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should send 400 status if payerId from transaction does not match payerId from ALL transaction details', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          {
            amount: 100,
            payerId: 2,
            recipientId: 2,
            groupId: 1,
          },
        ],
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should send 400 status if a transaction detail has a negative amount', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], amount: -100 },
        ],
      });
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should send a 400 status if the amount from the transaction details do not match the transaction amount', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], amount: 50 },
        ],
      });
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should work with multiple transaction details', async () => {
    const response = await createTransaction({
      Transaction: newTransaction,
      TransactionDetailsPartial: [
        { payerId: 1, recipientId: 2, groupId: 1, amount: 50 },
        { payerId: 1, recipientId: 1, groupId: 1, amount: 50 },
      ],
    });
    expect(response.status).toBe(201);
  });

  it('should NOT work with multiple transaction details that sum up to the wrong amount', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          { payerId: 1, recipientId: 2, groupId: 1, amount: 50 },
          { payerId: 1, recipientId: 1, groupId: 1, amount: 50 },
          { payerId: 1, recipientId: 1, groupId: 1, amount: 50 },
        ],
      });
      expect(response.status).toBe(400);
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
          expect(axiosError.response.data).toBe(
            'Transaction total does not equal sum of transaction details'
          );
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should fail when sending a groupId that does not exist', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: { ...newTransaction, groupId: 999 },
        TransactionDetailsPartial: newTransactionDetails,
      });
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(404);
          expect(axiosError.response.data).toBe('group id does not exist: 999');
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should fail when transaction details group to do not match transaction', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], groupId: 999 },
        ],
      });
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
          expect(axiosError.response.data).toBe(
            'Transaction group does not match transaction details group'
          );
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should fail when sending a groupId that does not exist (Handles many details)', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], groupId: 999, amount: 5 },
          { ...newTransactionDetails[0], groupId: 1, amount: 55 },
          { ...newTransactionDetails[0], groupId: 1, amount: 40 },
        ],
      });
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
          expect(axiosError.response.data).toBe(
            'Transaction group does not match transaction details group'
          );
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('handles three details)', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: newTransaction,
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], groupId: 1, amount: 5 },
          { ...newTransactionDetails[0], groupId: 1, amount: 55 },
          { ...newTransactionDetails[0], groupId: 1, amount: 40 },
        ],
      });
      expect(response.status).toBe(201);
      expect(response.data.transactionDetails?.length).toBe(3);
    } catch (error) {
      isError = true;
    }
    expect(isError).toBe(false);
  });

  it('should fail when sending a negative detail amount even if the sums equal the transaction amount', async () => {
    let isError = false;
    try {
      const response = await createTransaction({
        Transaction: { ...newTransaction, amount: 55 },
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], amount: 5 },
          { ...newTransactionDetails[0], amount: 55 },
          { ...newTransactionDetails[0], amount: -5 },
        ],
      });
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          expect(axiosError.response.status).toBe(400);
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should create the correct amount of transactions successfully', async () => {
    const currentTransactions = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    // create 10 transactions with random amounts and alternates between users 1 and 2, sums must equal 100
    for (let i = 0; i < 10; i++) {
      const amount = Math.floor(Math.random() * 100);
      const response = await createTransaction({
        Transaction: { ...newTransaction, amount },
        TransactionDetailsPartial: [
          { ...newTransactionDetails[0], amount: amount / 2 },
          { ...newTransactionDetails[0], amount: amount / 2 },
        ],
      });
    }
    const newTransactions = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    expect(newTransactions.data.length).toBe(
      currentTransactions.data.length + 10
    );
  });

  // write a test case that doesn't send sensitive user information to the client and maybe same with the group information

  afterAll(() => {
    // Cleanup tasks after all tests are finished
    // For example, closing database connections
  });
});
