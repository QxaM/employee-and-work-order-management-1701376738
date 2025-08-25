import { Service } from '../../../src/types/components/ServiceStatusTypes.ts';
import * as gatewayApiModule from '../../../src/store/api/gateway.ts';
import { afterEach, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import StatusBadge from '../../../src/components/serviceStatus/StatusBadge.tsx';
import { renderWithProviders } from '../../test-utils.tsx';
import { customBaseQuery } from '../../../src/store/api/base.ts';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

vi.mock('../../../src/store/api/gateway.ts', () => ({
  useGatewayHealthcheckQuery: vi.fn(),
}));

describe('StatusBadge', () => {
  const iconTestId = 'status-badge-icon';
  const service: Service = 'gateway';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
    vi.mocked(gatewayApiModule.useGatewayHealthcheckQuery).mockReturnValue({
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render status icon', () => {
    // Given

    // When
    renderWithProviders(<StatusBadge service={service} />);
    const iconElement = screen.getByTestId(iconTestId);

    // Then
    expect(iconElement).toBeInTheDocument();
  });

  it('Should render online text', () => {
    // Given
    const text = 'online';

    // When
    renderWithProviders(<StatusBadge service={service} />);
    const onlineElement = screen.getByText(text);

    // Then
    expect(onlineElement).toBeInTheDocument();
  });

  it('Should render starting text', () => {
    // Given
    const text = 'starting';
    vi.mocked(gatewayApiModule.useGatewayHealthcheckQuery).mockReturnValue({
      isSuccess: false,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    // When
    renderWithProviders(<StatusBadge service={service} />);
    const startingElement = screen.getByText(text);

    // Then
    expect(startingElement).toBeInTheDocument();
  });

  it('Should render offline text', () => {
    // Given
    const text = 'offline';
    vi.mocked(gatewayApiModule.useGatewayHealthcheckQuery).mockReturnValue({
      isSuccess: false,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    // When
    renderWithProviders(<StatusBadge service={service} />);
    const startingElement = screen.getByText(text);

    // Then
    expect(startingElement).toBeInTheDocument();
  });
});
