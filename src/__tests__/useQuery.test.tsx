import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { clearQueryCache } from '../useQuery';
import { mockRequest, mockPromise } from './fakeRequest';
import { Queries } from './Query';

describe('useQuery', () => {
  afterEach(() => {
    clearQueryCache();
  });

  it('request and load data', async () => {
    render(<Queries />);

    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-4')).toHaveTextContent('Loading');

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(mockRequest).toHaveBeenNthCalledWith(1, 2);
    expect(mockRequest).toHaveBeenNthCalledWith(2, 1);

    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('data-2')).toHaveTextContent('2');
      expect(screen.getByTestId('data-3')).toHaveTextContent('1');
      expect(screen.getByTestId('data-4')).toHaveTextContent('2');
    });

    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-4')).toHaveTextContent('Loaded');

    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-4')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('plus-3'));
    expect(screen.getByTestId('data-3')).toHaveTextContent('2');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(mockRequest).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByTestId('plus-3'));
    expect(screen.getByTestId('data-3')).toBeEmptyDOMElement();
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loading');
    await waitFor(() => {
      expect(screen.getByTestId('data-3')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('error-3')).toBeEmptyDOMElement();
    expect(mockRequest).toHaveBeenCalledTimes(3);
    expect(mockRequest).toHaveBeenNthCalledWith(3, 3);

    fireEvent.click(screen.getByTestId('refetch-2'));
    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-4')).toHaveTextContent('Loading');

    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    expect(screen.getByTestId('data-2')).toHaveTextContent('2');
    expect(screen.getByTestId('data-3')).toHaveTextContent('3');
    expect(screen.getByTestId('data-4')).toHaveTextContent('2');

    expect(screen.getByTestId('refetch-data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('refetch-data-4')).toBeEmptyDOMElement();

    await waitFor(() => {
      expect(screen.getByTestId('loading-1')).toHaveTextContent('Loaded');
      expect(screen.getByTestId('loading-2')).toHaveTextContent('Loaded');
      expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
      expect(screen.getByTestId('loading-4')).toHaveTextContent('Loaded');

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

  it('handle errors', async () => {
    mockPromise.mockImplementationOnce(() => {
      throw new Error('Network Error');
    });

    render(<Queries />);

    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-4')).toHaveTextContent('Loading');

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

    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-4')).toHaveTextContent('Loaded');

    mockRequest.mockImplementationOnce(() => {
      throw new Error('Unknown Error');
    });
    fireEvent.click(screen.getByTestId('plus-1'));
    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-3')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-4')).toHaveTextContent('Loaded');

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
});

describe('Query cache', () => {
  it('save data in cache', async () => {
    render(<Queries />);

    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
      expect(screen.getByTestId('data-2')).toHaveTextContent('2');
      expect(screen.getByTestId('data-3')).toHaveTextContent('1');
      expect(screen.getByTestId('data-4')).toHaveTextContent('2');
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it('load data from cache', () => {
    render(<Queries />);

    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    expect(screen.getByTestId('data-2')).toHaveTextContent('2');
    expect(screen.getByTestId('data-3')).toHaveTextContent('1');
    expect(screen.getByTestId('data-4')).toHaveTextContent('2');

    expect(mockRequest).toHaveBeenCalledTimes(0);
  });
});
