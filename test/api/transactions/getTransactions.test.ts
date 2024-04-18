import axios from 'axios';
import type { Transaction } from '../../../types/api';

describe('API Testing', () => {
  it('should return a successful response code on a valid request', async () => {
    const response = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    expect(response.status).toBe(200);
  });

  it('should return a list of transactions', async () => {
    const response = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    expect(response.data).toBeDefined();
    expect(response.data.length).toBeGreaterThan(0);
  });

  it('should have all of the correct keys on the transaction object (This test does not check for FK linked objects', async () => {
    const response = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    const transaction = response.data[0];
    expect(transaction).toHaveProperty('id');
    expect(transaction).toHaveProperty('createdBy');
    expect(transaction).toHaveProperty('payerId');
    expect(transaction).toHaveProperty('amount');
    expect(transaction).toHaveProperty('description');
    expect(transaction).toHaveProperty('createdAt');
    expect(transaction).toHaveProperty('updatedAt');
    expect(transaction).toHaveProperty('groupId');
  });

  it('should have all transaction details', async () => {
    const response = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    const transaction = response.data[0];
    expect(transaction.transactionDetails).toBeDefined();
    expect(transaction.transactionDetails?.length).toBeGreaterThan(0);
  });

  it('Should have the amount from transaction match the sum of the transaction details', async () => {
    const response = await axios.get<Transaction[]>(
      'http://localhost:5217/api/v1/Transactions'
    );
    const transaction = response.data[0];
    const total = transaction.transactionDetails?.reduce(
      (acc, detail) => acc + detail.amount,
      0
    );
    expect(total).toBe(transaction.amount);
  });

  afterAll(() => {
    // Cleanup tasks after all tests are finished
    // For example, closing database connections
  });
});
