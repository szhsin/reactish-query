/**
 * @vitest-environment node
 */

import { renderToString } from 'react-dom/server';
import { QueryObserver } from './QueryObserver';

describe('Server rendering', () => {
  it('call useEffect on server', () => {
    const htmlString = renderToString(<QueryObserver queryName="a" />);
    expect(htmlString).toContain('<div data-testid="status-a">idle</div>');
  });
});
