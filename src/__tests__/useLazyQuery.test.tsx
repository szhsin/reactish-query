import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { queryCache } from '../queryCache';
import { mockRequest } from './fakeRequest';
import { LazyQuery } from './LazyQuery';

describe('useLazyQuery', () => {
  afterEach(() => {
    queryCache.clear();
  });

  it('loads data when triggered', async () => {
    render(
      <>
        <LazyQuery queryName="1" defaultId={1} />
        <LazyQuery queryName="2" defaultId={1} />
      </>
    );

    expect(mockRequest).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('loading-1')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('data-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-1'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    });
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-2')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-2'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('data-1')).toHaveTextContent('1');
    expect(screen.getByTestId('data-2')).toHaveTextContent('1');
    expect(screen.getByTestId('loading-2')).toHaveTextContent('Loading');
    await waitFor(() => {
      expect(screen.getByTestId('loading-2')).toHaveTextContent('Loaded');
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
  });
});
