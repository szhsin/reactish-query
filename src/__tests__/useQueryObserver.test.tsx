import { screen, fireEvent, waitFor } from '@testing-library/react';
import { testModes } from './testModes';
import { QueryProvider, defaultQueryClient } from '../index';
import { mockRequest, mockPromise } from './fakeRequest';
import { QueryObserver, MutationObserver } from './QueryObserver';

const onData = vi.fn();
const onError = vi.fn();

const Queries = () => (
  <QueryProvider defaultOptions={{ staleTime: Infinity }}>
    <QueryObserver queryName="a" onData={onData} onError={onError}>
      <QueryObserver queryName="b" onData={onData} onError={onError} />
    </QueryObserver>
  </QueryProvider>
);

describe.each(testModes)('QueryObserver (%s)', (_, render) => {
  afterEach(() => {
    defaultQueryClient.clear();
  });

  it('calls onData when query resolves', async () => {
    render(<Queries />);

    expect(onData).toHaveBeenCalledTimes(0);
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('1');
    });
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenCalledTimes(2);
    expect(onData).toHaveBeenNthCalledWith(
      1,
      { data: 1, id: 1, query: 'b' },
      { queryKey: { requestId: 1 } }
    );
    expect(onData).toHaveBeenNthCalledWith(
      2,
      { data: 1, id: 1, query: 'a' },
      { queryKey: { requestId: 1 } }
    );
    onData.mockClear();

    fireEvent.click(screen.getByTestId('plus-a'));
    expect(onData).toHaveBeenCalledTimes(0);
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
    });
    expect(onData).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenLastCalledWith(
      { data: 2, id: 2, query: 'a' },
      { queryKey: { requestId: 2 } }
    );
    onData.mockClear();

    fireEvent.click(screen.getByTestId('plus-b'));
    expect(screen.getByTestId('data-b')).toHaveTextContent('2');
    expect(onData).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenLastCalledWith(
      { data: 2, id: 2, query: 'b' },
      { queryKey: { requestId: 2 } }
    );
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
    expect(onData).toHaveBeenLastCalledWith(
      { data: 5, id: 5, query: 'a' },
      { queryKey: { requestId: 5 } }
    );
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
    expect(onError).toHaveBeenNthCalledWith(
      1,
      {
        error: 'Network Error',
        id: 1,
        query: 'b'
      },
      { queryKey: { requestId: 1 } }
    );
    expect(onError).toHaveBeenNthCalledWith(
      2,
      {
        error: 'Network Error',
        id: 1,
        query: 'a'
      },
      { queryKey: { requestId: 1 } }
    );
    onError.mockClear();

    fireEvent.click(screen.getByTestId('plus-a'));
    expect(onError).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
    await waitFor(() => {
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith(
      {
        error: 'Network Error',
        id: 2,
        query: 'a'
      },
      { queryKey: { requestId: 2 } }
    );
    onError.mockClear();

    expect(onError).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByTestId('plus-b'));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith(
      {
        error: 'Network Error',
        id: 2,
        query: 'b'
      },
      { queryKey: { requestId: 2 } }
    );
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
    expect(onError).toHaveBeenNthCalledWith(
      1,
      {
        error: 'Network Error',
        id: 2,
        query: 'a'
      },
      { queryKey: { requestId: 2 } }
    );
    expect(onError).toHaveBeenNthCalledWith(
      2,
      {
        error: 'Network Error',
        id: 2,
        query: 'b'
      },
      { queryKey: { requestId: 2 } }
    );
    onError.mockClear();

    fireEvent.click(screen.getByTestId('plus-b'));
    fireEvent.click(screen.getByTestId('plus-b'));
    fireEvent.click(screen.getByTestId('plus-b'));
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith(
      {
        error: 'Network Error',
        id: 5,
        query: 'b'
      },
      { queryKey: { requestId: 5 } }
    );
    onError.mockClear();

    expect(onData).toHaveBeenCalledTimes(0);
    mockPromise.mockReset();
  });
});

describe.each(testModes)('MutationObserver (%s)', (_, render) => {
  it('calls onData when query resolves', async () => {
    render(<MutationObserver queryName="a" onData={onData} onError={onError} />);

    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    });
    expect(onData).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenLastCalledWith(
      { data: 1, id: 1, query: 'a' },
      {
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      }
    );

    fireEvent.click(screen.getByTestId('plus-a'));
    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(screen.getByTestId('args-a')).toHaveTextContent('2');
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
    });
    expect(onData).toHaveBeenCalledTimes(2);
    expect(onData).toHaveBeenLastCalledWith(
      { data: 2, id: 2, query: 'a' },
      {
        queryKey: { keyId: 2 },
        args: { paramId: 2 }
      }
    );
  });

  it('calls onError when query rejects', async () => {
    mockPromise.mockImplementation(() => {
      throw new Error('Network Error');
    });

    render(<MutationObserver queryName="a" onData={onData} onError={onError} />);

    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    await waitFor(() => {
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith(
      {
        error: 'Network Error',
        id: 1,
        query: 'a'
      },
      {
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      }
    );

    fireEvent.click(screen.getByTestId('plus-a'));
    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(screen.getByTestId('args-a')).toHaveTextContent('2');
    await waitFor(() => {
      expect(screen.getByTestId('error-a')).toHaveTextContent('Network Error');
    });
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenLastCalledWith(
      {
        error: 'Network Error',
        id: 2,
        query: 'a'
      },
      {
        queryKey: { keyId: 2 },
        args: { paramId: 2 }
      }
    );

    mockPromise.mockReset();
  });
});
