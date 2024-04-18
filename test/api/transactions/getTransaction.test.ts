import axios, { AxiosError } from 'axios';
import type { Transaction } from '../../../types/api';

async function getTransaction(transactionId: string) {
  const response = await axios.get<Transaction>(
    `http://localhost:5217/api/v1/Transactions/${transactionId}`
  );
  return response;
}

describe('Get a single transaction', () => {
  it('Should return a 200 status code on a valid request', async () => {
    const response = await getTransaction('1');
    expect(response.status).toBe(200);
  });
  it('Should return a transaction object', async () => {
    const response = await getTransaction('1');
    const transaction = response.data;
    expect(transaction).toBeDefined();
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
  });
  it('should contain the correct information from the requested transaction', async () => {
    const { data: transaction1 } = await getTransaction('6');

    expect(transaction1.id).toBe(6);
    expect(transaction1.createdBy).toBe(1);
    expect(transaction1.payerId).toBe(1);
    expect(transaction1.amount).toBe(100);
    expect(transaction1.description).toBe('Test Transaction');
    expect(transaction1.groupId).toBe(1);

    const { data: transaction2 } = await getTransaction('2');
    expect(transaction2.id).toBe(2);
    expect(transaction2.createdBy).toBe(1);
    expect(transaction2.payerId).toBe(1);
    expect(transaction2.amount).toBe(1000);
    expect(transaction2.description).toBe(null);
    expect(transaction2.groupId).toBe(1);
  });

  it('should contain the transaction details for the requested transaction', async () => {
    const { data: transaction } = await getTransaction('1');

    const transactionDetails = transaction.transactionDetails;
    expect(transactionDetails).toBeDefined();
    expect(transactionDetails?.length).toBe(1);
    expect(transactionDetails?.[0].transactionId).toBe(1);
    expect(transactionDetails?.[0].payerId).toBe(1);
    expect(transactionDetails?.[0].amount).toBe(1000);
    expect(transactionDetails?.[0].recipientId).toBe(2);
  });

  it('should return the correct amount of transaction details when there are more than one', async () => {
    const { data: transaction } = await getTransaction('184');

    const transactionDetails = transaction.transactionDetails;
    expect(transactionDetails).toBeDefined();
    expect(transactionDetails?.length).toBe(2);
    const firstDetail = transactionDetails?.[0];
    const secondDetail = transactionDetails?.[1];
    expect(firstDetail?.transactionId).toBe(184);
    expect(firstDetail?.payerId).toBe(1);
    expect(firstDetail?.amount).toBe(48);
    expect(secondDetail?.transactionId).toBe(184);
    expect(secondDetail?.payerId).toBe(1);
    expect(secondDetail?.amount).toBe(48);
  });

  it('should return a 404 if the transaction does not exist', async () => {
    let isError = false;
    try {
      await getTransaction('999999');
    } catch (error) {
      isError = true;
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        expect(axiosError.response?.status).toBe(404);
      }
    }
  });

  afterAll(() => {
    // Cleanup tasks after all tests are finished
    // For example, closing database connections
  });
});
