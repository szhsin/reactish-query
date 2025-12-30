import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { testModes } from './testModes';
import { QueryProvider, createQueryClient } from '../index';
import { queryObserver } from '../middleware';
import { mockRequest, delayFor } from './fakeRequest';
import { Query } from './Query';
import { LazyQuery } from './LazyQuery';

const onData = vi.fn();
const queryClient = createQueryClient({
  middleware: queryObserver({ onData })
});

describe.each(testModes)('queryClient (%s)', (_, render) => {
  afterEach(() => {
    queryClient.clear();
  });

  it('acts on Query', async () => {
    render(
      <QueryProvider client={queryClient}>
        <Query queryName="a">
          <Query queryName="b" />
          <Query queryName="c" />
        </Query>
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('1');
      expect(screen.getByTestId('data-c')).toHaveTextContent('1');
    });
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(
      queryClient.getData<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 1 }
      })?.result
    ).toBe(1);

    onData.mockClear();
    act(() => {
      queryClient.setData<{ result: number }, { requestId: number }>(
        {
          queryKey: { requestId: 1 }
        },
        { result: 9 }
      );
    });
    expect(onData).toHaveBeenLastCalledWith(
      {
        result: 9
      },
      { queryKey: { requestId: 1 }, args: undefined }
    );
    expect(
      queryClient.getData<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 1 }
      })?.result
    ).toBe(9);
    expect(screen.getByTestId('data-a')).toHaveTextContent('9');
    expect(screen.getByTestId('data-b')).toHaveTextContent('9');
    expect(screen.getByTestId('data-c')).toHaveTextContent('9');

    onData.mockClear();
    await act(async () => {
      const result = await queryClient.invalidate<
        { result: number },
        { requestId: number }
      >({
        queryKey: { requestId: 1 }
      });
      expect(result).toEqual({
        data: {
          result: 1
        },
        error: undefined
      });
    });
    expect(onData).toHaveBeenLastCalledWith(
      {
        result: 1
      },
      { queryKey: { requestId: 1 }, args: undefined }
    );
    expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    expect(screen.getByTestId('data-b')).toHaveTextContent('1');
    expect(screen.getByTestId('data-c')).toHaveTextContent('1');

    act(() => {
      // Calling methods with a non-existing cache entry will be ignored
      queryClient.setData<{ result: number }, { requestId: number }>(
        {
          queryKey: { requestId: 2 }
        },
        { result: 8 }
      );

      queryClient.invalidate<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 8 }
      });

      queryClient.cancel<{ requestId: number }>({
        queryKey: { requestId: 9 }
      });
    });

    fireEvent.click(screen.getByTestId('plus-a'));
    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
    });

    expect(
      queryClient.getData<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 3 }
      })?.result
    ).toBeUndefined();
    onData.mockClear();
    await act(async () => {
      // `fetch` will populate a new cache entry if it doesn’t exist
      const result = await queryClient.fetch<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 3 },
        queryFn: () => ({ result: 7 })
      });
      expect(result).toEqual({
        data: {
          result: 7
        },
        error: undefined
      });
    });
    expect(onData).toHaveBeenLastCalledWith(
      {
        result: 7
      },
      { queryKey: { requestId: 3 } }
    );
    expect(
      queryClient.getData<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 3 }
      })?.result
    ).toBe(7);

    onData.mockClear();
    await act(async () => {
      // `fetch` will return the data from cache if it's still fresh
      const result = await queryClient.fetch<{ result: number }, { requestId: number }>({
        queryKey: { requestId: 3 },
        queryFn: () => ({ result: 8 }),
        staleTime: 100
      });
      expect(result).toEqual({
        data: {
          result: 7
        }
      });
    });
    expect(onData).not.toHaveBeenCalled();

    // Switch to entry 3 and wait for the data to be revalidated
    fireEvent.click(screen.getByTestId('plus-a'));
    expect(screen.getByTestId('data-a')).toHaveTextContent('7');
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('3');
    });

    // Canceling a query
    act(() => {
      queryClient.setData<{ result: number }, { requestId: number }>(
        {
          queryKey: { requestId: 3 }
        },
        { result: 7 }
      );
    });
    expect(screen.getByTestId('data-a')).toHaveTextContent('7');
    fireEvent.click(screen.getByTestId('refetch-a'));
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    act(() => {
      queryClient.cancel<{ requestId: number }>({
        queryKey: { requestId: 3 }
      });
    });
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    await delayFor(50);
    expect(screen.getByTestId('data-a')).toHaveTextContent('7');
  });

  it('acts on LazyQuery', async () => {
    render(
      <QueryProvider client={queryClient}>
        <LazyQuery queryName="a" />
      </QueryProvider>
    );
    fireEvent.click(screen.getByTestId('trigger-a'));
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    });

    onData.mockClear();
    act(() => {
      queryClient.setData<{ result: number }, { keyId: number }, { paramId: number }>(
        {
          queryKey: { keyId: 1 },
          args: { paramId: 1 }
        },
        { result: 9 }
      );
    });
    expect(onData).toHaveBeenLastCalledWith(
      {
        result: 9
      },
      { queryKey: { keyId: 1 }, args: { paramId: 1 } }
    );
    expect(screen.getByTestId('data-a')).toHaveTextContent('9');
    expect(
      queryClient.getData<{ result: number }, { keyId: number }, { paramId: number }>({
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      })?.result
    ).toBe(9);

    onData.mockClear();
    await act(async () => {
      const result = await queryClient.invalidate({
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      });
      expect(result).toEqual({
        data: {
          result: 1
        },
        error: undefined
      });
    });
    expect(onData).toHaveBeenLastCalledWith(
      {
        result: 1
      },
      { queryKey: { keyId: 1 }, args: { paramId: 1 } }
    );
    expect(screen.getByTestId('data-a')).toHaveTextContent('1');
    expect(
      queryClient.getData<{ result: number }>({
        queryKey: { keyId: 1 },
        args: { paramId: 1 }
      })?.result
    ).toBe(1);
  });

  it('queryKey is optional when args is provided', async () => {
    const result = await queryClient.fetch<unknown, number, number>({
      args: 1,
      queryFn: ({ args }) => args! * 2
    });

    expect(result).toEqual({
      data: 2,
      error: undefined
    });
    expect(queryClient.getData({ args: 1 })).toBe(2);
  });
});
