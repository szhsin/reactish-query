import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { QueryProvider, defaultQueryClient } from '../index';
import { mockRequest, mockPromise } from './fakeRequest';
import { QueryObserver } from './QueryObserver';

const onData = vi.fn();
const onError = vi.fn();

const Queries = () => (
  <QueryProvider defaultOptions={{ staleTime: Infinity }}>
    <QueryObserver queryName="a" onData={onData} onError={onError}>
      <QueryObserver queryName="b" onData={onData} onError={onError} />
    </QueryObserver>
  </QueryProvider>
);

describe('useQueryObserver', () => {
  afterEach(() => {
    defaultQueryClient.clearCache();
  });

  it('calls onData with primitive data type', async () => {
    render(<Queries />);

    expect(onData).toHaveBeenCalledTimes(0);
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('1');
    });
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenCalledTimes(2);
    expect(onData).toHaveBeenNthCalledWith(1, { data: 1, id: 1, query: 'b' });
    expect(onData).toHaveBeenNthCalledWith(2, { data: 1, id: 1, query: 'a' });
    onData.mockClear();

    fireEvent.click(screen.getByTestId('plus-a'));
    expect(onData).toHaveBeenCalledTimes(0);
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
    });
    expect(onData).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenLastCalledWith({ data: 2, id: 2, query: 'a' });
    onData.mockClear();

    fireEvent.click(screen.getByTestId('plus-b'));
    expect(screen.getByTestId('data-b')).toHaveTextContent('2');
    expect(onData).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenLastCalledWith({ data: 2, id: 2, query: 'b' });
    onData.mockClear();

    fireEvent.click(screen.getByTestId('refetch-a'));
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    });
    expect(onData).toHaveBeenCalledTimes(0);
    onData.mockClear();

    fireEvent.click(screen.getByTestId('plus-a'));
    fireEvent.click(screen.getByTestId('plus-a'));
    fireEvent.click(screen.getByTestId('plus-a'));
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('5');
    });
    expect(onData).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenLastCalledWith({ data: 5, id: 5, query: 'a' });
    onData.mockClear();

    expect(onError).toHaveBeenCalledTimes(0);
  });

  it('calls onError when query rejects', async () => {
    mockPromise.mockImplementation(() => {
      throw new Error('Network Error');
    });

    render(<Queries />);
    expect(onError).toHaveBeenCalledTimes(0);
    await waitFor(() => {
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('error-b')).toHaveTextContent('Network Error');
    });
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenNthCalledWith(1, {
      error: 'Network Error',
      id: 1,
      query: 'b'
    });
    expect(onError).toHaveBeenNthCalledWith(2, {
      error: 'Network Error',
      id: 1,
      query: 'a'
    });
    onError.mockClear();

    fireEvent.click(screen.getByTestId('plus-a'));
    expect(onError).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
    await waitFor(() => {
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith({
      error: 'Network Error',
      id: 2,
      query: 'a'
    });
    onError.mockClear();

    expect(onError).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByTestId('plus-b'));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith({
      error: 'Network Error',
      id: 2,
      query: 'b'
    });
    expect(screen.getByTestId('error-b')).toHaveTextContent('Network Error');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    });
    onError.mockClear();

    fireEvent.click(screen.getByTestId('refetch-b'));
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    });
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenNthCalledWith(1, {
      error: 'Network Error',
      id: 2,
      query: 'a'
    });
    expect(onError).toHaveBeenNthCalledWith(2, {
      error: 'Network Error',
      id: 2,
      query: 'b'
    });
    onError.mockClear();

    fireEvent.click(screen.getByTestId('plus-b'));
    fireEvent.click(screen.getByTestId('plus-b'));
    fireEvent.click(screen.getByTestId('plus-b'));
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith({
      error: 'Network Error',
      id: 5,
      query: 'b'
    });
    onError.mockClear();

    expect(onData).toHaveBeenCalledTimes(0);
    mockPromise.mockReset();
  });
});
