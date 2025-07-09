const mockRequest = vi.fn();
const mockPromise = vi.fn();

const fakeRequest = <T>(value: T, delay = 0) => {
  mockRequest(value);
  return new Promise<{ result: T }>((resolve, reject) => {
    setTimeout(() => {
      try {
        mockPromise(value);
        resolve({ result: value });
      } catch (error) {
        reject(error as Error);
      }
    }, delay);
  });
};

export { fakeRequest, mockRequest, mockPromise };
