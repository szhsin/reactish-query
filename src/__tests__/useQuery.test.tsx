import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { queryCache } from '../queryCache';
import { mockRequest, mockPromise } from './fakeRequest';
import { Queries, Query } from './Query';

describe('useQuery', () => {
  afterEach(() => {
    queryCache.clear();
  });

  it('requests and loads data', async () => {
    render(<Queries />);

    expect(screen.getByTestId('status-1')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-2')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-3')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-4')).toHaveTextContent('fetching');

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(mockRequest).toHaveBeenNthCalledWith(1, 2);
    expect(mockRequest).toHaveBeenNthCalledWith(2, 1);

    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('data-2')).toHaveTextContent('2');
      expect(screen.getByTestId('data-3')).toHaveTextContent('1');
      expect(screen.getByTestId('data-4')).toHaveTextContent('2');
    });

    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-4')).toHaveTextContent('idle');

    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-4')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('plus-3'));
    expect(screen.getByTestId('data-3')).toHaveTextContent('2');
    expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(mockRequest).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByTestId('plus-3'));
    expect(screen.getByTestId('data-3')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-3')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('data-3')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(mockRequest).toHaveBeenCalledTimes(3);
    expect(mockRequest).toHaveBeenNthCalledWith(3, 3);

    fireEvent.click(screen.getByTestId('refetch-2'));
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-4')).toHaveTextContent('fetching');

    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    expect(screen.getByTestId('data-2')).toHaveTextContent('2');
    expect(screen.getByTestId('data-3')).toHaveTextContent('3');
    expect(screen.getByTestId('data-4')).toHaveTextContent('2');

    expect(screen.getByTestId('refetch-data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-data-4')).toBeEmptyDOMElement();

    await waitFor(() => {
      expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
      expect(screen.getByTestId('status-4')).toHaveTextContent('idle');

      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('data-2')).toHaveTextContent('2');
      expect(screen.getByTestId('data-3')).toHaveTextContent('3');
      expect(screen.getByTestId('data-4')).toHaveTextContent('2');

      expect(screen.getByTestId('refetch-data-2')).toHaveTextContent('2');
      expect(screen.getByTestId('refetch-data-4')).toBeEmptyDOMElement();
    });
    expect(mockRequest).toHaveBeenCalledTimes(4);
    expect(mockRequest).toHaveBeenNthCalledWith(4, 2);
  });

  it('handles errors', async () => {
    mockPromise.mockImplementationOnce(() => {
      throw new Error('Network Error');
    });

    render(<Queries />);

    expect(screen.getByTestId('status-1')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-2')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-3')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-4')).toHaveTextContent('fetching');

    expect(mockRequest).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();
      expect(screen.getByTestId('data-3')).toHaveTextContent('1');
      expect(screen.getByTestId('data-4')).toBeEmptyDOMElement();

      expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
      expect(screen.getByTestId('error-2')).toHaveTextContent('Network Error');
      expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
      expect(screen.getByTestId('error-4')).toHaveTextContent('Network Error');
    });

    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-4')).toHaveTextContent('idle');

    mockRequest.mockImplementationOnce(() => {
      throw new Error('Unknown Error');
    });
    fireEvent.click(screen.getByTestId('plus-1'));
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-3')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-4')).toHaveTextContent('idle');

    expect(screen.getByTestId('data-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-3')).toHaveTextContent('1');
    expect(screen.getByTestId('data-4')).toBeEmptyDOMElement();

    expect(screen.getByTestId('error-1')).toHaveTextContent('Unknown Error');
    expect(screen.getByTestId('error-2')).toHaveTextContent('Unknown Error');
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-4')).toHaveTextContent('Unknown Error');

    expect(mockRequest).toHaveBeenCalledTimes(3);

    mockRequest.mockImplementationOnce(() => {
      throw new Error('Refetch Error');
    });
    expect(screen.getByTestId('refetch-error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-error-2')).toBeEmptyDOMElement();
    fireEvent.click(screen.getByTestId('refetch-1'));

    await waitFor(() => {
      expect(screen.getByTestId('refetch-error-1')).toHaveTextContent('Refetch Error');
      expect(screen.getByTestId('refetch-error-2')).toBeEmptyDOMElement();

      expect(screen.getByTestId('error-1')).toHaveTextContent('Refetch Error');
      expect(screen.getByTestId('error-2')).toHaveTextContent('Refetch Error');
      expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
      expect(screen.getByTestId('error-4')).toHaveTextContent('Refetch Error');
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
    it('does not deduplicate requests when cacheMode is off', async () => {
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

    it('respects prop update', async () => {
      const { rerender } = render(<Query queryName="cacheOff" cacheMode="off" />);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.getByTestId('data-cacheOff')).toHaveTextContent('1');
      });
      rerender(<Query queryName="cacheOff" />);
      expect(mockRequest).toHaveBeenCalledTimes(2);
      await waitFor(() => {
        expect(screen.getByTestId('data-cacheOff')).toHaveTextContent('1');
      });
    });
  });
});

describe('Query cache', () => {
  it('saves data in cache', async () => {
    render(<Queries />);

    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('data-2')).toHaveTextContent('2');
      expect(screen.getByTestId('data-3')).toHaveTextContent('1');
      expect(screen.getByTestId('data-4')).toHaveTextContent('2');
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it('loads data from cache', () => {
    render(<Queries />);

    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    expect(screen.getByTestId('data-2')).toHaveTextContent('2');
    expect(screen.getByTestId('data-3')).toHaveTextContent('1');
    expect(screen.getByTestId('data-4')).toHaveTextContent('2');

    expect(mockRequest).toHaveBeenCalledTimes(0);
  });
});
