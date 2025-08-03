import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { createQueryClient } from '../queryClient';
import { QueryProvider } from '../QueryProvider';
import { mockRequest } from './fakeRequest';
import { LazyQuery } from './LazyQuery';

const queryClient = createQueryClient();

describe('useLazyQuery', () => {
  afterEach(() => {
    queryClient.getCache().clear();
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
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-1'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('status-1')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
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
      expect(screen.getByTestId('data-1')).toHaveTextContent('2');
    });
    expect(screen.getByTestId('data-2')).toHaveTextContent('1');
  });
});
