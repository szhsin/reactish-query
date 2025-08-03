import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { mockRequest } from './fakeRequest';
import { Mutation } from './Mutation';

describe('useMutation', () => {
  it('loads data when triggered', async () => {
    render(
      <>
        <Mutation queryName="1" defaultId={1} />
        <Mutation queryName="2" defaultId={1} />
      </>
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
      expect(screen.getByTestId('data-1')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-2')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-2'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('data-1')).toHaveTextContent('3');
    expect(screen.getByTestId('data-2')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-2')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('data-2')).toHaveTextContent('3');
      expect(screen.getByTestId('status-2')).toHaveTextContent('idle');
    });
  });

  it('works when key is optional', async () => {
    render(<Mutation queryName="1" noKey />);

    expect(mockRequest).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('data-1')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-1'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('status-1')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('data-1')).toHaveTextContent('2');
    });
    expect(screen.getByTestId('status-1')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-1')).toBeEmptyDOMElement();
  });
});
