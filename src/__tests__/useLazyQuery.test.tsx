import { applyMiddleware } from 'reactish-state/middleware';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { testModes } from './testModes';
import { createQueryClient, defaultQueryClient, QueryProvider } from '../index';
import { queryObserver } from '../middleware';
import { mockRequest, mockPromise, delayFor } from './fakeRequest';
import { LazyQuery, LazyQueryData } from './LazyQuery';

const onData = vi.fn();
const onError = vi.fn();
const queryClient = createQueryClient({
  middleware: applyMiddleware([queryObserver({ onData, onError })])
});

describe.each(testModes)('useLazyQuery (%s)', (_, render) => {
  afterEach(() => {
    queryClient.clear();
    defaultQueryClient.clear();
  });

  it('loads data when triggered', async () => {
    render(
      <QueryProvider client={queryClient}>
        <LazyQuery queryName="a" defaultId={1} />
        <LazyQuery queryName="b" defaultId={1} />
      </QueryProvider>
    );

    expect(mockRequest).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('args-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('args-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-data-a')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    await waitFor(() => {
      expect(onData).toHaveBeenLastCalledWith(
        {
          result: 1
        },
        { queryKey: { keyId: 1 }, args: { paramId: 1 } }
      );
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('refetch-data-a')).toHaveTextContent('1');
    });
    expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-b')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-b'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toHaveTextContent('1');
    expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    expect(screen.getByTestId('data-b')).toHaveTextContent('1');
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(onData).toHaveBeenLastCalledWith(
        {
          result: 1
        },
        { queryKey: { keyId: 1 }, args: { paramId: 1 } }
      );
      expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByTestId('plus-a'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(mockRequest).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId('args-a')).toHaveTextContent('2');
    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
    await waitFor(() => {
      expect(onData).toHaveBeenLastCalledWith(
        {
          result: 2
        },
        { queryKey: { keyId: 2 }, args: { paramId: 2 } }
      );
      expect(screen.getByTestId('args-a')).toHaveTextContent('2');
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
    });
    expect(screen.getByTestId('data-b')).toHaveTextContent('1');
    expect(onData).toHaveBeenCalledTimes(3);
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles errors', async () => {
    render(
      <QueryProvider client={queryClient}>
        <LazyQuery queryName="a" defaultId={1} />
      </QueryProvider>
    );

    const networkError = new Error('Network Error');
    mockPromise.mockImplementationOnce(() => {
      throw networkError;
    });

    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-error-a')).toBeEmptyDOMElement();

    await waitFor(() => {
      expect(onError).toHaveBeenLastCalledWith(networkError, {
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      });
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('refetch-error-a')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onData).not.toHaveBeenCalled();
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

describe('useLazyQuery$', () => {
  afterEach(() => {
    defaultQueryClient.clear();
  });

  describe('Render behaviour', () => {
    const mockRender = vi.fn();
    it('renders correct times in a single query', async () => {
      render(<LazyQueryData queryName="a" render={mockRender} />);
      // Initial render
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('args-a')).toBeEmptyDOMElement();

      fireEvent.click(screen.getByTestId('trigger-a'));
      expect(screen.getByTestId('args-a')).toHaveTextContent('1');
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      });
      // Resolve cache entry/start fetching; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(3);

      fireEvent.click(screen.getByTestId('trigger-a'));
      expect(screen.getByTestId('args-a')).toHaveTextContent('1');
      await delayFor(50);
      // No rendering as data has not changed
      expect(mockRender).toHaveBeenCalledTimes(3);

      fireEvent.click(screen.getByTestId('plus-a'));
      fireEvent.click(screen.getByTestId('trigger-a'));
      expect(screen.getByTestId('args-a')).toHaveTextContent('2');
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('2');
      });
      // Update id; resolve cache entry; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(6);

      mockPromise.mockImplementationOnce(() => {
        throw new Error('Network Error');
      });
      fireEvent.click(screen.getByTestId('trigger-a'));
      await delayFor(50);
      expect(screen.getByTestId('args-a')).toHaveTextContent('2');
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
      expect(mockRender).toHaveBeenCalledTimes(6);
    });

    it('renders correct times in multiple queries', async () => {
      render(
        <QueryProvider defaultOptions={{ staleTime: Infinity }}>
          <LazyQueryData queryName="a" render={mockRender} />
          <LazyQueryData queryName="b" render={mockRender} />
        </QueryProvider>
      );
      // Initial render
      expect(mockRequest).toHaveBeenCalledTimes(0);
      expect(mockRender).toHaveBeenCalledTimes(2);

      fireEvent.click(screen.getByTestId('trigger-a'));
      fireEvent.click(screen.getByTestId('trigger-b'));
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
        expect(screen.getByTestId('data-b')).toHaveTextContent('1');
      });
      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(mockRender).toHaveBeenCalledTimes(6);

      fireEvent.click(screen.getByTestId('trigger-a'));
      fireEvent.click(screen.getByTestId('trigger-b'));
      await delayFor(50);
      expect(mockRender).toHaveBeenCalledTimes(6);
    });
  });
});
