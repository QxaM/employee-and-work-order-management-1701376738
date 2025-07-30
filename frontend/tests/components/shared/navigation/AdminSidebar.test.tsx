import { renderWithProviders } from '../../../test-utils.tsx';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';

import AdminSidebar from '../../../../src/components/shared/navigation/AdminSidebar.tsx';

describe('AdminSidebar', () => {
  it('Should contain Role Update button', () => {
    // Given
    const roleUpdateButtonLabel = 'Roles Update';

    renderWithProviders(
      <BrowserRouter>
        <AdminSidebar />
      </BrowserRouter>
    );

    // When
    const roleUpdate = screen.getByText(roleUpdateButtonLabel, {
      exact: false,
    });

    // Then
    expect(roleUpdate).toBeInTheDocument();
  });

  it('Should navigate to Roles Update page, when clicking roles update', () => {
    // Given
    const roleUpdateButtonLabel = 'Roles Update';

    renderWithProviders(
      <BrowserRouter>
        <AdminSidebar />
      </BrowserRouter>
    );
    const roleUpdate = screen.getByText(roleUpdateButtonLabel, {
      exact: false,
    });

    // When
    fireEvent.click(roleUpdate);

    // Then
    expect(window.location.pathname.endsWith('roles-update')).toBe(true);
  });
});
