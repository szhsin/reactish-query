import { StrictMode, ReactNode } from 'react';
import { render } from '@testing-library/react';

const testModes = [
  ['Normal Mode', (ui: ReactNode) => render(ui)],
  ['Strict Mode', (ui: ReactNode) => render(<StrictMode>{ui}</StrictMode>)]
] as const;

export { testModes };
