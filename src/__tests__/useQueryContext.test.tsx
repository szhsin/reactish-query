import { memo } from 'react';
import { render } from '@testing-library/react';
import {
  useQueryContext,
  QueryProvider,
  defaultQueryClient,
  createQueryClient,
  QueryContextType
} from '../index';

const mockQueryContext = vi.fn();
const MockApp = memo(() => {
  mockQueryContext(useQueryContext());
  return null;
});

describe('useQueryContext', () => {
  it('returns defaults when there is no provider', () => {
    render(<MockApp />);
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: defaultQueryClient,
      defaultOptions: {}
    });
  });

  it('returns defaults when provider has no props', () => {
    render(
      <QueryProvider>
        <QueryProvider>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: defaultQueryClient,
      defaultOptions: {}
    });
  });

  it('updates context value correctly on provider prop changes and rerenders', () => {
    const client1 = createQueryClient();
    const client2 = createQueryClient();
    const { rerender } = render(
      <QueryProvider
        client={client1}
        defaultOptions={{ cacheMode: 'off', staleTime: 1000 }}
      >
        <QueryProvider client={client2} defaultOptions={{ cacheMode: 'persist' }}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: { cacheMode: 'persist' }
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(1);

    // Re-rendering with the same props
    rerender(
      <QueryProvider
        client={client1}
        defaultOptions={{ cacheMode: 'off', staleTime: 1000 }}
      >
        <QueryProvider client={client2} defaultOptions={{ cacheMode: 'persist' }}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenCalledTimes(1);

    // Re-rendering without defaultOptions on child provider - update context
    rerender(
      <QueryProvider
        client={client1}
        defaultOptions={{ cacheMode: 'off', staleTime: 1000 }}
      >
        <QueryProvider client={client2}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: { cacheMode: 'off', staleTime: 1000 }
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(2);

    // Re-rendering with the same props
    rerender(
      <QueryProvider
        client={client1}
        defaultOptions={{ cacheMode: 'off', staleTime: 1000 }}
      >
        <QueryProvider client={client2}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenCalledTimes(2);

    // Re-rendering without defaultOptions on parent provider - update context
    rerender(
      <QueryProvider client={client1} defaultOptions={undefined}>
        <QueryProvider client={client2}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: {}
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(3);

    // Re-rendering with defaultOptions explicitly set to undefined
    rerender(
      <QueryProvider client={client1}>
        <QueryProvider client={client2} defaultOptions={undefined}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: {}
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(3);

    // Re-rendering with different props - update context
    rerender(
      <QueryProvider
        client={client1}
        defaultOptions={{ cacheMode: 'off', staleTime: 1000 }}
      >
        <QueryProvider client={client2} defaultOptions={{ cacheMode: 'auto' }}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: { cacheMode: 'auto' }
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(4);

    // Re-rendering with an empty defaultOptions - update context
    rerender(
      <QueryProvider
        client={client1}
        defaultOptions={{ cacheMode: 'off', staleTime: 1000 }}
      >
        <QueryProvider client={client2} defaultOptions={{}}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: {}
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(5);

    // Re-rendering with new query client prop values — ignored
    rerender(
      <QueryProvider
        client={createQueryClient()}
        defaultOptions={{ cacheMode: 'persist' }}
      >
        <QueryProvider client={createQueryClient()} defaultOptions={{ staleTime: 2000 }}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: { staleTime: 2000 }
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(6);

    // Re-rendering without the client prop — still uses the initial client
    rerender(
      <QueryProvider defaultOptions={{ cacheMode: 'persist' }}>
        <QueryProvider defaultOptions={{ staleTime: 3000 }}>
          <MockApp />
        </QueryProvider>
      </QueryProvider>
    );
    expect(mockQueryContext).toHaveBeenLastCalledWith<QueryContextType[]>({
      client: client2,
      defaultOptions: { staleTime: 3000 }
    });
    expect(mockQueryContext).toHaveBeenCalledTimes(7);
  });
});
