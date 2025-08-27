import { renderWithProviders } from '../test-utils.tsx';
import { afterEach, beforeEach } from 'vitest';
import { customBaseQuery } from '../../src/store/api/base.ts';
import HomePage from '../../src/pages/HomePage.tsx';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should contain title', () => {
    // Given
    const title = 'Transform Your';

    // When
    renderWithProviders(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should contain demo callout', () => {
    // Given
    const demoMessage = 'Demo Environment Notice.';

    // When
    renderWithProviders(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const demoElement = screen.getByText(demoMessage);

    // Then
    expect(demoElement).toBeInTheDocument();
  });

  it('Should contain services status', () => {
    // Given
    const statusTitle = 'System Status';

    // When
    renderWithProviders(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const statusElement = screen.getByText(statusTitle);

    // Then
    expect(statusElement).toBeInTheDocument();
  });
});
