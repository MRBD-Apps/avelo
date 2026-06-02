import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisplayRoot } from 'mrbd-ui-kit';
import { Counter } from './Counter';

// Kit components (Button, Focusable…) need a <DisplayRoot> ancestor for the focus engine.
describe('Counter', () => {
  it('renders the initial count and the add button', () => {
    render(
      <DisplayRoot>
        <Counter />
      </DisplayRoot>,
    );
    expect(screen.getByText('0 items')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/ })).toBeInTheDocument();
  });
});
