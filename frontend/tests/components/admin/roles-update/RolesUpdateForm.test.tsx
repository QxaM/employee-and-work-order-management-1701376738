import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import RolesUpdateForm from '../../../../src/components/admin/roles-update/RolesUpdateForm.tsx';
import { RoleType } from '../../../../src/types/api/RoleTypes.ts';
import { afterEach, beforeEach, describe, expect } from 'vitest';
import {
  createDataRouter,
  renderWithProviders,
  renderWithProvidersAndModals,
} from '../../../test-utils.tsx';
import { RouterProvider } from 'react-router-dom';
import * as stateSubmitModule from '../../../../src/hooks/useStateSubmit.tsx';

const path = '/admin/roles-update';

const user = {
  id: 1,
  email: 'test@test.com',
  roles: [
    {
      id: 1,
      name: 'ROLE',
    },
    {
      id: 2,
      name: 'ROLE 2',
    },
  ],
};
const rolesData: RoleType[] = [
  {
    id: 1,
    name: 'ROLE',
  },
  {
    id: 2,
    name: 'ROLE 2',
  },
  {
    id: 3,
    name: 'ROLE 3',
  },
  {
    id: 4,
    name: 'ROLE 4',
  },
];

const roles = {
  data: rolesData,
  isSuccess: true,
  isPending: false,
  isError: false,
  error: undefined,
};

describe('Roles Update Form', () => {
  const availableRoles = 'Available Roles';

  let router: ReturnType<typeof createDataRouter>;

  const mockStateSubmit = {
    submit: vi.fn(),
    data: undefined,
    isSuccess: false,
    isPending: false,
    isError: false,
    error: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    router = createDataRouter(
      path,
      <RolesUpdateForm user={user} roles={roles} />
    );

    vi.spyOn(stateSubmitModule, 'useStateSubmit').mockReturnValue(
      mockStateSubmit
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Components render', () => {
    it('Should render user data section', () => {
      // Given
      const userDataTitle = 'User Data';

      renderWithProviders(<RouterProvider router={router} />);

      // When
      const userSection = screen.getByLabelText(userDataTitle);

      // Then
      expect(userSection).toBeInTheDocument();
    });

    it('Should not render Available Roles when roles fetching is pending', () => {
      // Given
      const sectionTitle = 'Available Roles';
      const RolesUpdateElement = (
        <RolesUpdateForm
          user={user}
          roles={{
            ...roles,
            isPending: true,
          }}
        />
      );
      const router = createDataRouter(path, RolesUpdateElement);

      renderWithProviders(<RouterProvider router={router} />);

      // When
      const sectionTitleElement = screen.queryByRole('heading', {
        name: sectionTitle,
      });

      // Then
      expect(sectionTitleElement).not.toBeInTheDocument();
    });

    it('Should render empty table, when success but roles null', () => {
      // Given
      const RolesUpdateElement = (
        <RolesUpdateForm
          user={user}
          roles={{
            ...roles,
            data: undefined,
          }}
        />
      );
      const router = createDataRouter(path, RolesUpdateElement);
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const assignedRolesSection = screen.getByLabelText(availableRoles);
      const renderedRoles = rolesData.map((role) =>
        within(assignedRolesSection).queryByText(role.name)
      );

      // Then
      for (const roleElement of renderedRoles) {
        expect(roleElement).not.toBeInTheDocument();
      }
    });

    it('Should render Error Component when error fetching all roles', () => {
      // Given
      const error = 'Error fetching roles';
      const RolesUpdateElement = (
        <RolesUpdateForm
          user={user}
          roles={{
            data: undefined,
            isSuccess: false,
            isPending: false,
            isError: true,
            error: {
              status: 400,
              message: error,
            },
          }}
        />
      );
      const router = createDataRouter(path, RolesUpdateElement);
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const errorElement = screen.getByText(error);

      // Then
      expect(errorElement).toBeInTheDocument();
    });

    it('Should render Error Component with default error', () => {
      // Given
      const defaultErrorMessage =
        'Error while fetching roles data, try again later';
      const RolesUpdateElement = (
        <RolesUpdateForm
          user={user}
          roles={{
            data: undefined,
            isSuccess: false,
            isPending: false,
            isError: true,
            error: undefined,
          }}
        />
      );
      const router = createDataRouter(path, RolesUpdateElement);
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const errorElement = screen.getByText(defaultErrorMessage);

      // Then
      expect(errorElement).toBeInTheDocument();
    });

    it('Should not render roles section when error', () => {
      // Given
      const assignedRolesTitle = 'Assigned Roles';
      const availableRolesTitle = 'Available Roles';

      const RolesUpdateElement = (
        <RolesUpdateForm
          user={user}
          roles={{
            data: undefined,
            isSuccess: false,
            isPending: false,
            isError: true,
            error: undefined,
          }}
        />
      );
      const router = createDataRouter(path, RolesUpdateElement);

      renderWithProviders(<RouterProvider router={router} />);

      // When
      const assignedRolesSection = screen.queryByLabelText(assignedRolesTitle);
      const availableRolesSection =
        screen.queryByLabelText(availableRolesTitle);

      // Then
      expect(assignedRolesSection).not.toBeInTheDocument();
      expect(availableRolesSection).not.toBeInTheDocument();
    });

    describe('Control buttons', () => {
      it('Should render submit and render button', () => {
        // Given
        const submitButtonText = 'Update';
        const cancelButtonText = 'Close';

        renderWithProviders(<RouterProvider router={router} />);

        // When
        const submitButton = screen.getByRole('button', {
          name: submitButtonText,
        });
        const cancelButton = screen.getByRole('button', {
          name: cancelButtonText,
        });

        // Then
        expect(submitButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
      });

      it('Should not render Update button on error', () => {
        // Given
        const submitButtonText = 'Update';
        const RolesUpdateElement = (
          <RolesUpdateForm
            user={user}
            roles={{
              ...roles,
              isError: true,
            }}
          />
        );
        const router = createDataRouter(path, RolesUpdateElement);
        renderWithProviders(<RouterProvider router={router} />);

        // When
        const submitButton = screen.queryByRole('button', {
          name: submitButtonText,
        });

        // Then
        expect(submitButton).not.toBeInTheDocument();
      });

      it('Should close dialog when close clicked', () => {
        // Given
        const mockClose = vi.fn();
        const cancelButtonText = 'Close';

        const RolesUpdateElement = (
          <RolesUpdateForm user={user} roles={roles} onClose={mockClose} />
        );
        const router = createDataRouter(path, RolesUpdateElement);
        renderWithProviders(<RouterProvider router={router} />);

        const cancelButton = screen.getByRole('button', {
          name: cancelButtonText,
        });

        // When
        fireEvent.click(cancelButton);

        // Then
        expect(mockClose).toHaveBeenCalledOnce();
      });
    });
  });

  describe('Update submission', () => {
    const submitButtonText = 'Update';

    it('Should submit roles to update', async () => {
      // Given
      renderWithProviders(<RouterProvider router={router} />);
      const submitButton = screen.getByRole('button', {
        name: submitButtonText,
      });

      const roleToAddRole = rolesData.find(
        (role) => !user.roles.some((userRole) => userRole.id === role.id)
      );
      const roleToAdd = screen.getByText(roleToAddRole?.name ?? 'undefined');
      fireEvent.click(roleToAdd);

      const addRoleButton = screen.getByLabelText('add role');
      fireEvent.click(addRoleButton);

      // When
      fireEvent.click(submitButton);
      const submitData = {
        userId: user.id,
        addRoles: JSON.stringify([roleToAddRole]),
        removeRoles: JSON.stringify([]),
      };

      // Then
      await waitFor(() => {
        expect(mockStateSubmit.submit).toHaveBeenCalledOnce();
        expect(mockStateSubmit.submit).toHaveBeenCalledWith(submitData, {
          method: 'PATCH',
          encType: 'application/json',
        });
      });
    });

    it('Should submit roles to remove', () => {
      // Given
      renderWithProviders(<RouterProvider router={router} />);
      const submitButton = screen.getByRole('button', {
        name: submitButtonText,
      });

      const roleToRemoveRole = user.roles[0];
      const roleToRemove = screen.getByText(roleToRemoveRole.name);
      fireEvent.click(roleToRemove);

      const removeRoleButton = screen.getByLabelText('remove role');
      fireEvent.click(removeRoleButton);

      // When
      fireEvent.click(submitButton);
      const submitData = {
        userId: user.id,
        addRoles: JSON.stringify([]),
        removeRoles: JSON.stringify([roleToRemoveRole]),
      };

      // Then
      expect(mockStateSubmit.submit).toHaveBeenCalledOnce();
      expect(mockStateSubmit.submit).toHaveBeenCalledWith(submitData, {
        method: 'PATCH',
        encType: 'application/json',
      });
    });

    it('Should render spinner when submitting', () => {
      // Given
      const formControlsTitle = 'form controls';
      vi.spyOn(stateSubmitModule, 'useStateSubmit').mockReturnValue({
        submit: vi.fn(),
        isSuccess: false,
        isPending: true,
        isError: false,
        error: undefined,
        data: undefined,
      });

      renderWithProviders(<RouterProvider router={router} />);

      // When
      const formControlsSection = screen.getByLabelText(formControlsTitle);
      const loadingSpinner = within(formControlsSection).getByTestId('spinner');

      // Then
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  describe('Dialog renders', () => {
    it('Should render success dialog on success', async () => {
      // Given
      const successMessage = `Successfully updated roles for user ${user.id}`;
      const mockStateSubmit = {
        submit: vi.fn(),
        data: undefined,
        isSuccess: true,
        isPending: false,
        isError: false,
        error: undefined,
      };
      vi.spyOn(stateSubmitModule, 'useStateSubmit').mockReturnValue(
        mockStateSubmit
      );

      // When
      const { store } = renderWithProvidersAndModals(
        <RouterProvider router={router} />
      );

      // Then
      const modals = store.getState().modal.modals;
      expect(modals).toHaveLength(1);
      expect(modals[0]).toEqual(
        expect.objectContaining({
          content: expect.objectContaining({
            type: 'success',
            message: successMessage,
          }) as unknown,
        })
      );
    });

    it('Should render error dialog on error', () => {
      // Given
      const errorMessage = `Test error message`;
      const mockStateSubmit = {
        submit: vi.fn(),
        data: undefined,
        isSuccess: false,
        isPending: false,
        isError: true,
        error: new Error(errorMessage),
      };
      vi.spyOn(stateSubmitModule, 'useStateSubmit').mockReturnValue(
        mockStateSubmit
      );

      // When
      const { store } = renderWithProvidersAndModals(
        <RouterProvider router={router} />
      );

      // Then
      const modals = store.getState().modal.modals;
      expect(modals).toHaveLength(1);
      expect(modals[0]).toEqual(
        expect.objectContaining({
          content: expect.objectContaining({
            type: 'error',
            message: errorMessage,
          }) as unknown,
        })
      );
    });

    it('Should render default error', () => {
      // Given
      const defaultErrorMessage = `Error while updating roles for user ${user.id}`;
      const mockStateSubmit = {
        submit: vi.fn(),
        data: undefined,
        isSuccess: false,
        isPending: false,
        isError: true,
        error: undefined,
      };
      vi.spyOn(stateSubmitModule, 'useStateSubmit').mockReturnValue(
        mockStateSubmit
      );

      // When
      const { store } = renderWithProvidersAndModals(
        <RouterProvider router={router} />
      );

      // Then
      const modals = store.getState().modal.modals;
      expect(modals).toHaveLength(1);
      expect(modals[0]).toEqual(
        expect.objectContaining({
          content: expect.objectContaining({
            type: 'error',
            message: defaultErrorMessage,
          }) as unknown,
        })
      );
    });
  });
});
