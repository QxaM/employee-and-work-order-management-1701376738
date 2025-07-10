import { screen } from '@testing-library/react';

import { renderWithProviders } from '../test-utils.tsx';
import AdminPage from '../../src/pages/AdminPage.tsx';
import { BrowserRouter } from 'react-router-dom';

describe('AdminPage', () => {
  it('Should contain AdminSidebar', () => {
    // Given
    const roleUpdateButtonLabel = 'Roles Update';

    renderWithProviders(
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    );

    // When
    const roleUpdate = screen.getByText(roleUpdateButtonLabel, {
      exact: false,
    });

    // Then
    expect(roleUpdate).toBeInTheDocument();
  });
});
