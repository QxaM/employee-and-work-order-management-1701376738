import { Service } from '../../../src/types/components/ServiceStatusTypes.ts';
import { renderWithProviders } from '../../test-utils.tsx';
import ServiceStatusCard from '../../../src/components/service-status/ServiceStatusCard.tsx';
import { screen } from '@testing-library/react';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { beforeEach } from 'vitest';
import { customBaseQuery } from '../../../src/store/api/base.ts';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

describe('ServiceStatusCard', () => {
  const name = 'Test service';
  const service: Service = 'gateway';

  beforeEach(() => {
    vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
  });

  it('Should render name', () => {
    // Given

    // When
    renderWithProviders(<ServiceStatusCard name={name} service={service} />);
    const nameElement = screen.getByText(name);

    // Then
    expect(nameElement).toBeInTheDocument();
  });

  it('Should render icon if provided', () => {
    // Given
    const iconTestId = 'test-icon';
    const TestIcon = () => <EnvelopeClosedIcon data-testid={iconTestId} />;

    // When
    renderWithProviders(
      <ServiceStatusCard name={name} service={service} icon={TestIcon} />
    );
    const iconElement = screen.getByTestId(iconTestId);

    // Then
    expect(iconElement).toBeInTheDocument();
  });

  it('Should render status badge', () => {
    // Given

    // When
    renderWithProviders(<ServiceStatusCard name={name} service={service} />);
    const textElements = screen.getAllByRole('paragraph');

    // Then
    expect(textElements).toHaveLength(2);
  });
});
