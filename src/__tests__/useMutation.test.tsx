import { screen, fireEvent, waitFor } from '@testing-library/react';
import { testModes } from './testModes';
import { QueryProvider } from '../index';
import { mockRequest } from './fakeRequest';
import { Mutation } from './Mutation';

describe.each(testModes)('useMutation (%s)', (_, render) => {
  it('loads data when triggered', async () => {
    render(
      // `cacheMode` should be ignored by useMutation
      <QueryProvider defaultOptions={{ cacheMode: 'persist' }}>
        <Mutation queryName="a" defaultId={1} />
        <Mutation queryName="b" defaultId={1} />
      </QueryProvider>
    );

    expect(mockRequest).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('args-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('args-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('3');
    });
    expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
    expect(screen.getByTestId('error-b')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-b'));
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toHaveTextContent('1');
    expect(screen.getByTestId('data-a')).toHaveTextContent('3');
    expect(screen.getByTestId('data-b')).toBeEmptyDOMElement();
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-b')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('data-b')).toHaveTextContent('3');
      expect(screen.getByTestId('status-b')).toHaveTextContent('idle');
    });
    expect(screen.getByTestId('args-a')).toHaveTextContent('1');
    expect(screen.getByTestId('args-b')).toHaveTextContent('1');
  });

  it('works when key is optional', async () => {
    render(<Mutation queryName="a" noKey />);

    expect(mockRequest).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('data-a')).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId('trigger-a'));
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('status-a')).toHaveTextContent('fetching');
    await waitFor(() => {
      expect(screen.getByTestId('data-a')).toHaveTextContent('2');
    });
    expect(screen.getByTestId('status-a')).toHaveTextContent('idle');
    expect(screen.getByTestId('error-a')).toBeEmptyDOMElement();
  });
});
