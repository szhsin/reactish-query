import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { createQueryClient, defaultQueryClient } from '../queryClient';
import { QueryProvider } from '../QueryProvider';
import { eventListener } from '../middleware';
import { mockRequest, mockPromise, delayFor } from './fakeRequest';
import { LazyQuery } from './LazyQuery';

const onSuccess = vi.fn();
const onError = vi.fn();
const onSettled = vi.fn();
const queryClient = createQueryClient({
  middleware: eventListener({
    onSuccess,
    onError,
    onSettled
  })
});

describe('useLazyQuery', () => {
  afterEach(() => {
    queryClient.getCache().clear();
    defaultQueryClient.getCache().clear();
  });

  it('loads data when triggered', async () => {
    render(
      <QueryProvider value={queryClient}>
        <LazyQuery queryName="1" defaultId={1} />
        <LazyQuery queryName="2" defaultId={1} />
      </QueryProvider>
    );

    expect(mockRequest).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    expect(screen.getByTestId('data-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-data-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-1'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('status-1')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    await waitFor(() => {
      expect(onSuccess).toHaveBeenLastCalledWith(
        {
          result: 1
        },
        { queryKey: { keyId: 1 }, args: { paramId: 1 } }
      );
      expect(onSettled).toHaveBeenLastCalledWith(
        {
          result: 1
        },
        undefined,
        { queryKey: { keyId: 1 }, args: { paramId: 1 } }
      );
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('refetch-data-1')).toHaveTextContent('1');
    });
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-2')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-2'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    expect(screen.getByTestId('data-2')).toHaveTextContent('1');
    expect(screen.getByTestId('status-1')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-2')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(onSuccess).toHaveBeenLastCalledWith(
        {
          result: 1
        },
        { queryKey: { keyId: 1 }, args: { paramId: 1 } }
      );
      expect(onSettled).toHaveBeenLastCalledWith(
        {
          result: 1
        },
        undefined,
        { queryKey: { keyId: 1 }, args: { paramId: 1 } }
      );
      expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByTestId('plus-1'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    fireEvent.click(screen.getByTestId('trigger-1'));
    expect(mockRequest).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId('data-1')).toBeEmptyDOMElement();
    await waitFor(() => {
      expect(onSuccess).toHaveBeenLastCalledWith(
        {
          result: 2
        },
        { queryKey: { keyId: 2 }, args: { paramId: 2 } }
      );
      expect(onSettled).toHaveBeenLastCalledWith(
        {
          result: 2
        },
        undefined,
        { queryKey: { keyId: 2 }, args: { paramId: 2 } }
      );
      expect(screen.getByTestId('data-1')).toHaveTextContent('2');
    });
    expect(screen.getByTestId('data-2')).toHaveTextContent('1');
    expect(onSuccess).toHaveBeenCalledTimes(3);
    expect(onSettled).toHaveBeenCalledTimes(3);
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles errors', async () => {
    render(
      <QueryProvider value={queryClient}>
        <LazyQuery queryName="1" defaultId={1} />
      </QueryProvider>
    );

    const networkError = new Error('Network Error');
    mockPromise.mockImplementationOnce(() => {
      throw networkError;
    });

    fireEvent.click(screen.getByTestId('trigger-1'));
    expect(screen.getByTestId('data-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-error-1')).toBeEmptyDOMElement();

    await waitFor(() => {
      expect(onError).toHaveBeenLastCalledWith(networkError, {
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      });
      expect(onSettled).toHaveBeenLastCalledWith(undefined, networkError, {
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      });
      expect(screen.getByTestId('error-1')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('refetch-error-1')).toHaveTextContent('Network Error');
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('resolves only the most recent response', async () => {
    render(
      <>
        <LazyQuery queryName="a" defaultId={1} requestVariation />
        <LazyQuery queryName="b" defaultId={1} requestVariation />
      </>
    );
    fireEvent.click(screen.getByTestId('trigger-a'));
    fireEvent.click(screen.getByTestId('trigger-a'));
    fireEvent.click(screen.getByTestId('trigger-b'));
    fireEvent.click(screen.getByTestId('trigger-b'));
    fireEvent.click(screen.getByTestId('trigger-b'));
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await delayFor(500);
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('data-a')).toHaveTextContent(/^1.3$/);
    expect(screen.getByTestId('data-b')).toHaveTextContent(/^1.3$/);
  });
});
