import { api } from '../../src/store/apiSlice';

// Mock the customBaseQuery
vi.mock('../../src/store/api/base', () => ({
  customBaseQuery: vi.fn(),
}));

describe('API Slice', () => {
  it('Should have empty endpoints initially', () => {
    // Given
    const initialEndpoints = 0;

    // When
    const apiEndpoints = Object.keys(api.endpoints);

    // Then
    expect(apiEndpoints).toHaveLength(initialEndpoints);
  });

  it('Should have Roles in tagTypes', () => {
    // Given
    const roleTag = 'Roles';

    // When + Then
    expect(() => {
      api.util.invalidateTags([roleTag]);
    }).not.toThrow();
  });

  it('Should have Users in tagTypes', () => {
    // Given
    const roleTag = 'Users';

    // When + Then
    expect(() => {
      api.util.invalidateTags([roleTag]);
    }).not.toThrow();
  });

  it('Should have Me in tagTypes', () => {
    // Given
    const roleTag = 'Me';

    // When + Then
    expect(() => {
      api.util.invalidateTags([roleTag]);
    }).not.toThrow();
  });
});
