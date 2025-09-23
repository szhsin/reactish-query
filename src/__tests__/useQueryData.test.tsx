import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { testModes } from './testModes';
import { QueryProvider, defaultQueryClient } from '../index';
import { mockRequest, mockPromise, delayFor } from './fakeRequest';
import { QueryData } from './QueryData';

describe('useQueryData', () => {
  afterEach(() => {
    defaultQueryClient.clear();
  });

  it.each(testModes)('requests and loads data (%s)', async (_, render) => {
    render(
      <>
        <QueryData queryName="a" />
        <QueryData queryName="b" />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      expect(screen.getByTestId('data-b')).toHaveTextContent('1');
    });
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  describe('Render behaviour', () => {
    const mockRender = vi.fn();
    it('renders correct times in a single query', async () => {
      render(<QueryData queryName="a" render={mockRender} />);
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
      });
      // Initial render; resolve cache entry/start fetching; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(3);

      fireEvent.click(screen.getByTestId('refetch-a'));
      await delayFor(50);
      // No rendering as data has not changed
      expect(mockRender).toHaveBeenCalledTimes(3);

      fireEvent.click(screen.getByTestId('plus-a'));
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('2');
      });
      // Update id; resolve cache entry; fetch resolved
      expect(mockRender).toHaveBeenCalledTimes(6);

      mockPromise.mockImplementationOnce(() => {
        throw new Error('Network Error');
      });
      fireEvent.click(screen.getByTestId('refetch-a'));
      await delayFor(50);
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
      expect(mockRender).toHaveBeenCalledTimes(6);
    });

    it('renders correct times in multiple queries', async () => {
      render(
        <QueryProvider defaultOptions={{ staleTime: Infinity }}>
          <QueryData queryName="a" render={mockRender} />
          <QueryData queryName="b" render={mockRender} />
        </QueryProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('data-a')).toHaveTextContent('1');
        expect(screen.getByTestId('data-b')).toHaveTextContent('1');
      });
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRender).toHaveBeenCalledTimes(6);

      fireEvent.click(screen.getByTestId('refetch-a'));
      fireEvent.click(screen.getByTestId('refetch-b'));
      await delayFor(50);
      expect(mockRender).toHaveBeenCalledTimes(6);
    });
  });
});
