/* This file is check what happens at various stages if there is an error from the API.
 These errors will come in manually from the API so these tests will not work ordinarily*/
import axios, { AxiosError } from 'axios';
import type { Transaction } from '../../../types/api';

describe('API Testing', () => {
  it('should return an error upon a forced error from the API', async () => {
    let isError = false;
    try {
      const response = await axios.get<Transaction[]>(
        'http://localhost:5217/api/v1/Transactions'
      );
    } catch (error) {
      isError = true;
      expect(error).toBeDefined();
    }
    expect(isError).toBe(true);
  });

  it('should have an error message', async () => {
    let isError = false;
    try {
      const response = await axios.get<Transaction[]>(
        'http://localhost:5217/api/v1/Transactions'
      );
    } catch (error) {
      if (error instanceof Error) {
        isError = true;
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
      }
    }
    expect(isError).toBe(true);
  });
  it('The error message should start with internal server error', async () => {
    let isError = false;
    try {
      const response = await axios.get<Transaction[]>(
        'http://localhost:5217/api/v1/Transactions'
      );
    } catch (error) {
      isError = true;
      // expect error to have a data property from axios
      if (error instanceof Error) {
        isError = true;
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            expect(axiosError.response.data).toBeDefined();
            expect(axiosError.response.data).toMatch(/Internal server error: /);
          }
        }
      }
    }
    expect(isError).toBe(true);
  });
  it('should return a status code of 500', async () => {
    let isError = false;
    try {
      const response = await axios.get<Transaction[]>(
        'http://localhost:5217/api/v1/Transactions'
      );
    } catch (error) {
      if (error instanceof Error) {
        isError = true;
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            expect(axiosError.response.status).toBe(500);
          }
        }
      }
    }
    expect(isError).toBe(true);
  });

  it('should end with the correct status message', async () => {
    let isError = false;
    try {
      const response = await axios.get<Transaction[]>(
        'http://localhost:5217/api/v1/Transactions'
      );
    } catch (error) {
      if (error instanceof Error) {
        isError = true;
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            expect(axiosError.response.data).toMatch(
              /Mock error for testing logging and error handling/
            );
          }
        }
      }
    }
    expect(isError).toBe(true);
  });

  afterAll(() => {
    // Cleanup tasks after all tests are finished
    // For example, closing database connections
  });
});
