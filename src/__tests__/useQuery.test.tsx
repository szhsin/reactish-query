import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { QueryProvider, defaultQueryClient } from '../index';
import { mockRequest, mockPromise, delayFor } from './fakeRequest';
import { Queries, Query } from './Query';

describe('useQuery', () => {
  afterEach(() => {
    defaultQueryClient.clearCache();
  });

  it('requests and loads data', async () => {
    render(<Queries />);

    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-c')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-d')).toHaveTextContent('fetching');

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(mockRequest).toHaveBeenNthCalledWith(1, { result: 2 });
    expect(mockRequest).toHaveBeenNthCalledWith(2, { result: 1 });

    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('2');
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');
      expect(screen.getByTestId('data-d')).toHaveTextContent('2');
    });

    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-d')).toHaveTextContent('idle');

    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-c')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-d')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('plus-c'));
    expect(screen.getByTestId('data-c')).toHaveTextContent('2');
    expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-c')).toBeEmptyDOMElement();
    expect(mockRequest).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByTestId('plus-c'));
    expect(screen.getByTestId('data-c')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-c')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('data-c')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-c')).toBeEmptyDOMElement();
    expect(mockRequest).toHaveBeenCalledTimes(3);
    expect(mockRequest).toHaveBeenNthCalledWith(3, { result: 3 });

    fireEvent.click(screen.getByTestId('refetch-b'));
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-d')).toHaveTextContent('fetching');

    expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    expect(screen.getByTestId('data-b')).toHaveTextContent('2');
    expect(screen.getByTestId('data-c')).toHaveTextContent('3');
    expect(screen.getByTestId('data-d')).toHaveTextContent('2');

    expect(screen.getByTestId('refetch-data-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-data-d')).toBeEmptyDOMElement();

    await waitFor(() => {
      expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-d')).toHaveTextContent('idle');

      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('2');
      expect(screen.getByTestId('data-c')).toHaveTextContent('3');
      expect(screen.getByTestId('data-d')).toHaveTextContent('2');

      expect(screen.getByTestId('refetch-data-b')).toHaveTextContent('2');
      expect(screen.getByTestId('refetch-data-d')).toBeEmptyDOMElement();
    });
    expect(mockRequest).toHaveBeenCalledTimes(4);
    expect(mockRequest).toHaveBeenNthCalledWith(4, { result: 2 });
  });

  it('handles errors', async () => {
    mockPromise.mockImplementationOnce(() => {
      throw new Error('Network Error');
    });

    render(<Queries />);

    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-c')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-d')).toHaveTextContent('fetching');

    expect(mockRequest).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');
      expect(screen.getByTestId('data-d')).toBeEmptyDOMElement();

      expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
      expect(screen.getByTestId('error-b')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('error-c')).toBeEmptyDOMElement();
      expect(screen.getByTestId('error-d')).toHaveTextContent('Network Error');
    });

    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-d')).toHaveTextContent('idle');

    mockRequest.mockImplementationOnce(() => {
      throw new Error('Unknown Error');
    });
    fireEvent.click(screen.getByTestId('plus-a'));
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-d')).toHaveTextContent('idle');

    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-c')).toHaveTextContent('1');
    expect(screen.getByTestId('data-d')).toBeEmptyDOMElement();

    expect(screen.getByTestId('error-a')).toHaveTextContent('Unknown Error');
    expect(screen.getByTestId('error-b')).toHaveTextContent('Unknown Error');
    expect(screen.getByTestId('error-c')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-d')).toHaveTextContent('Unknown Error');

    expect(mockRequest).toHaveBeenCalledTimes(3);

    mockRequest.mockImplementationOnce(() => {
      throw new Error('Refetch Error');
    });
    expect(screen.getByTestId('refetch-error-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-error-b')).toBeEmptyDOMElement();
    fireEvent.click(screen.getByTestId('refetch-a'));

    await waitFor(() => {
      expect(screen.getByTestId('refetch-error-a')).toHaveTextContent('Refetch Error');
      expect(screen.getByTestId('refetch-error-b')).toBeEmptyDOMElement();

      expect(screen.getByTestId('error-a')).toHaveTextContent('Refetch Error');
      expect(screen.getByTestId('error-b')).toHaveTextContent('Refetch Error');
      expect(screen.getByTestId('error-c')).toBeEmptyDOMElement();
      expect(screen.getByTestId('error-d')).toHaveTextContent('Refetch Error');
    });
  });

  describe('enabled option', () => {
    it('does not request data when not enabled', () => {
      const { rerender } = render(<Query queryName="enabled" enabled={false} />);
      expect(mockRequest).not.toHaveBeenCalled();
      expect(screen.getByTestId('status-enabled')).toHaveTextContent('idle');
      rerender(<Query queryName="enabled" enabled={true} />);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-enabled')).toHaveTextContent('fetching');
    });

    it('requests data when calling refetch', () => {
      render(<Query queryName="enabled" enabled={false} />);
      expect(mockRequest).not.toHaveBeenCalled();
      expect(screen.getByTestId('status-enabled')).toHaveTextContent('idle');
      fireEvent.click(screen.getByTestId('refetch-enabled'));
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-enabled')).toHaveTextContent('fetching');
    });
  });

  describe('cacheMode option', () => {
    it('sends individual requests when cacheMode is off', async () => {
      render(
        <div>
          <Query queryName="cacheOn1" />
          <Query queryName="cacheOff" cacheMode="off" />
          <Query queryName="cacheOn2" />
        </div>
      );
      expect(mockRequest).toHaveBeenCalledTimes(2);
      await waitFor(() => {
        expect(screen.getByTestId('data-cacheOn1')).toHaveTextContent('1');
        expect(screen.getByTestId('data-cacheOn2')).toHaveTextContent('1');
        expect(screen.getByTestId('data-cacheOff')).toHaveTextContent('1');
      });

      fireEvent.click(screen.getByTestId('refetch-cacheOff'));
      expect(screen.getByTestId('data-cacheOff')).toBeEmptyDOMElement();
      await waitFor(() => {
        expect(screen.getByTestId('data-cacheOff')).toHaveTextContent('1');
      });
    });

    it('deduplicates requests when different cache modes use the same key', async () => {
      render(
        <div>
          <Query queryName="a" cacheMode="persist" />
          <Query queryName="b" cacheMode="auto" />
          <Query queryName="c" cacheMode="persist" />
          <Query queryName="d" />
        </div>
      );
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      });

      expect(screen.getByTestId('data-b')).toHaveTextContent('1');
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');
      expect(screen.getByTestId('data-d')).toHaveTextContent('1');
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    it('respects prop update', async () => {
      const { rerender } = render(<Query queryName="a" cacheMode="off" />);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      });

      rerender(<Query queryName="a" />);
      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      });

      // weak -> strong
      rerender(<Query queryName="a" cacheMode="persist" />);
      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');

      // strong -> weak
      rerender(<Query queryName="a" cacheMode="auto" />);
      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    });

    it('uses value from defaultOptions', async () => {
      render(
        <QueryProvider defaultOptions={{ cacheMode: 'off' }}>
          <Query queryName="a" />
          <Query queryName="b" cacheMode="auto" />
          <Query queryName="c" cacheMode="persist" />
          <Query queryName="d" />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
        expect(screen.getByTestId('data-b')).toHaveTextContent('1');
        expect(screen.getByTestId('data-c')).toHaveTextContent('1');
        expect(screen.getByTestId('data-d')).toHaveTextContent('1');
      });

      expect(mockRequest).toHaveBeenCalledTimes(3);
    });
  });

  describe('staleTime option', () => {
    it('deduplicates requests when staleTime is 0', async () => {
      render(<Queries staleTime={0} />);

      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
        expect(screen.getByTestId('data-b')).toHaveTextContent('2');
        expect(screen.getByTestId('data-c')).toHaveTextContent('1');
        expect(screen.getByTestId('data-d')).toHaveTextContent('2');
      });

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });

    it('respects prop update', async () => {
      const { rerender } = render(<Query queryName="a" staleTime={0} />);
      expect(mockRequest).toHaveBeenCalledTimes(1);

      await delayFor(50);
      // Re-renders with a new staleTime value, without marking the data as stale
      rerender(<Query queryName="a" staleTime={75} />);
      expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(mockRequest).toHaveBeenCalledTimes(1);

      // Re-renders with a new staleTime value, marking the data as stale
      rerender(<Query queryName="a" staleTime={25} />);
      expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(mockRequest).toHaveBeenCalledTimes(2);

      await delayFor(50);
      // Re-renders without updating staleTime;
      // should not trigger a refetch even if the data becomes stale
      rerender(<Query queryName="a" staleTime={25} />);
      expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });

    it('fetches data when staleTime has passed', async () => {
      render(<Query queryName="a" />);
      expect(mockRequest).toHaveBeenCalledTimes(1);

      await delayFor(50);
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      render(<Query queryName="b" staleTime={100} />);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
      expect(screen.getByTestId('data-b')).toHaveTextContent('1');

      await delayFor(100);
      render(<Query queryName="c" staleTime={500} />);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');

      render(<Query queryName="d" staleTime={100} />);
      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('status-d')).toHaveTextContent('fetching');
      expect(screen.getByTestId('data-d')).toHaveTextContent('1');
    });

    it('uses value from defaultOptions', async () => {
      render(<Query queryName="a" />);
      expect(mockRequest).toHaveBeenCalledTimes(1);

      await delayFor(50);
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      render(
        <QueryProvider defaultOptions={{ staleTime: 100 }}>
          <Query queryName="b" />
        </QueryProvider>
      );
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
      expect(screen.getByTestId('data-b')).toHaveTextContent('1');

      await delayFor(100);
      render(
        <QueryProvider defaultOptions={{ staleTime: 50 }}>
          <Query queryName="c" staleTime={500} />
        </QueryProvider>
      );
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-c')).toHaveTextContent('idle');
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');

      render(
        <QueryProvider>
          <Query queryName="d" />
        </QueryProvider>
      );
      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('status-d')).toHaveTextContent('fetching');
      expect(screen.getByTestId('data-d')).toHaveTextContent('1');
    });
  });

  describe('Render behaviour', () => {
    const mockRender = vi.fn();
    it('renders correct times in a single query', async () => {
      render(<Query queryName="a" render={mockRender} noRefetchResult />);
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      });
      // Initial render; resolve cache entry/start fetching; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(3);

      fireEvent.click(screen.getByTestId('refetch-a'));
      expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
      await waitFor(() => {
        expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      });
      // Start fetching; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(5);

      fireEvent.click(screen.getByTestId('plus-a'));
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('2');
      });
      // Update id; start fetching; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(8);

      mockPromise.mockImplementationOnce(() => {
        throw new Error('Network Error');
      });
      fireEvent.click(screen.getByTestId('refetch-a'));
      await waitFor(() => {
        expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      });
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
      // Start fetching; fetch rejected
      expect(mockRender).toHaveBeenCalledTimes(10);
    });

    it('renders correct times in multiple queries', async () => {
      render(
        <QueryProvider defaultOptions={{ staleTime: Infinity }}>
          <Query queryName="a" render={mockRender} noRefetchResult />
          <Query queryName="b" render={mockRender} noRefetchResult />
        </QueryProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
        expect(screen.getByTestId('data-b')).toHaveTextContent('1');
      });
      expect(mockRender).toHaveBeenCalledTimes(6);

      fireEvent.click(screen.getByTestId('refetch-a'));
      expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
      await waitFor(() => {
        expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
      });
      expect(mockRender).toHaveBeenCalledTimes(10);
    });
  });
});

describe('Query cache', () => {
  it('saves data in cache', async () => {
    render(<Queries />);

    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('2');
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');
      expect(screen.getByTestId('data-d')).toHaveTextContent('2');
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it('loads data from cache', () => {
    render(<Queries />);

    expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    expect(screen.getByTestId('data-b')).toHaveTextContent('2');
    expect(screen.getByTestId('data-c')).toHaveTextContent('1');
    expect(screen.getByTestId('data-d')).toHaveTextContent('2');

    expect(mockRequest).toHaveBeenCalledTimes(0);
  });
});
