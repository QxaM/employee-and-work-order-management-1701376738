import { screen } from '@testing-library/react';
import ServicesStatusCard from '../../../src/components/serviceStatus/ServicesStatusCard.tsx';
import { renderWithProviders } from '../../test-utils.tsx';
import { APP_SERVICES } from '../../../src/types/components/ServiceStatusTypes.ts';
import { beforeEach } from 'vitest';
import { customBaseQuery } from '../../../src/store/api/base.ts';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

describe('ServicesStatusCard', () => {
  beforeEach(() => {
    vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
  });

  it('Should render title', () => {
    // Given
    const title = 'System Status';

    // When
    renderWithProviders(<ServicesStatusCard />);
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render description', () => {
    // Given
    const description = 'Real-time status of our microservice infrastructure.';

    // When
    renderWithProviders(<ServicesStatusCard />);
    const descriptionElement = screen.getByText(description);

    // Then
    expect(descriptionElement).toBeInTheDocument();
  });

  it('Should render all services', () => {
    // Given
    const microserviceNames = APP_SERVICES.map((service) => service.name);

    // When
    renderWithProviders(<ServicesStatusCard />);
    const serviceCards = microserviceNames.map((name) =>
      screen.getByText(name, { exact: false })
    );

    // Then
    expect(serviceCards).toHaveLength(microserviceNames.length);
  });
});
