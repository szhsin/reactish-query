import { waitFor } from '@testing-library/react';

const mockRequest = vi.fn();
const mockPromise = vi.fn();

const fakeRequest = <T>(value: T, delay = 0) => {
  mockRequest(value);
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        mockPromise(value);
        resolve(value);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      }
    }, delay);
  });
};

const delayFor = (delay = 0) =>
  waitFor(() => new Promise((resolve) => setTimeout(resolve, delay)));

export { delayFor, fakeRequest, mockRequest, mockPromise };
