import { afterEach, beforeAll, beforeEach } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import RolesUpdate from '../../../../src/components/admin/roles-update/RolesUpdate.tsx';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { GetUsersType } from '../../../../src/types/UserTypes.ts';
import { createDataRouter, renderWithProviders } from '../../../test-utils.tsx';
import { Router } from '@remix-run/router';
import * as roleSlice from '../../../../src/store/api/role.ts';
import { RoleType } from '../../../../src/types/RoleTypes.ts';

const path = '/admin/roles-update';

const USER_CONTENT = [
  {
    id: 589,
    email: 'operator@maxq.com',
    enabled: true,
    roles: [
      {
        id: 14,
        name: 'OPERATOR',
      },
      {
        id: 15,
        name: 'DESIGNER',
      },
    ],
  },
];

const MOCK_DEFAULT_USERS_DATA: GetUsersType = {
  content: USER_CONTENT,
  first: true,
  last: true,
  number: 0,
  totalPages: 1,
  size: 50,
  numberOfElements: 1,
  totalElements: 1,
};

const MOCK_ROLES: RoleType[] = [
  {
    id: 14,
    name: 'OPERATOR',
  },
  {
    id: 15,
    name: 'DESIGNER',
  },
  {
    id: 16,
    name: 'ADMIN',
  },
];

describe('RolesUpdate', () => {
  let router: Router;

  const mockRoleData = {
    data: MOCK_ROLES,
    isSuccess: true,
    isFetching: false,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(roleSlice, 'useGetRolesQuery').mockReturnValue(mockRoleData);

    router = createDataRouter(path, <RolesUpdate />, () => ({ content: [] }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render table title', async () => {
    // Given
    const title = 'User Roles Update';
    renderWithProviders(<RouterProvider router={router} />);

    // When
    const titleElement = await screen.findByText(title, { exact: false });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render table header row', async () => {
    // Given
    const id = 'ID';
    const email = 'Email';
    const currentRoles = 'Current Roles';

    renderWithProviders(<RouterProvider router={router} />);

    // When
    const idCell = await screen.findByRole('columnheader', { name: id });
    const emailCell = await screen.findByRole('columnheader', { name: email });
    const currentRolesCell = await screen.findByRole('columnheader', {
      name: currentRoles,
    });

    // Then
    expect(idCell).toBeInTheDocument();
    expect(emailCell).toBeInTheDocument();
    expect(currentRolesCell).toBeInTheDocument();
  });

  it('Should render data', async () => {
    // Given
    const router = createDataRouter(
      path,
      <RolesUpdate />,
      () => MOCK_DEFAULT_USERS_DATA
    );
    renderWithProviders(<RouterProvider router={router} />);

    // When
    const id = await screen.findByRole('cell', {
      name: MOCK_DEFAULT_USERS_DATA.content[0].id.toString(),
    });
    const email = await screen.findByRole('cell', {
      name: MOCK_DEFAULT_USERS_DATA.content[0].email,
    });
    const currentRoles = await screen.findByRole('cell', {
      name: MOCK_DEFAULT_USERS_DATA.content[0].roles
        .map((role) => role.name)
        .join(', '),
    });

    // Then
    expect(id).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(currentRoles).toBeInTheDocument();
  });

  describe('Page management', () => {
    const mockPageData: GetUsersType = {
      content: USER_CONTENT,
      first: true,
      last: false,
      number: 1,
      totalPages: 2,
      size: 1,
      numberOfElements: 1,
      totalElements: 2,
    };

    it('Should render Pageable', async () => {
      // Given
      const pageableLabel = 'pagination control';
      const mockLoader = vi.fn().mockReturnValue(mockPageData);

      const router = createDataRouter(path, <RolesUpdate />, mockLoader);
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const pageable = await screen.findByLabelText(pageableLabel);

      // Then
      expect(pageable).toBeInTheDocument();
    });

    it('Should reload data when page changes', async () => {
      // Given
      const nextPageLabel = 'next page';
      const mockLoader = vi.fn().mockReturnValue(mockPageData);

      const router = createDataRouter(path, <RolesUpdate />, mockLoader);
      renderWithProviders(<RouterProvider router={router} />);

      const nextPage = await screen.findByLabelText(nextPageLabel);
      const nextPageNumber = mockPageData.number + 1;

      // When
      fireEvent.click(nextPage);

      // Then
      expect(mockLoader).toHaveBeenCalledTimes(2);
      expect(mockLoader).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({
            url: expect.stringContaining(`page=${nextPageNumber}`) as string,
          }) as Partial<Request>,
        })
      );
    });
  });

  describe('Dialog management', () => {
    let router: ReturnType<typeof createMemoryRouter>;

    beforeAll(() => {
      const modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal');
      document.body.appendChild(modalRoot);
    });

    beforeEach(() => {
      router = createDataRouter(
        path,
        <RolesUpdate />,
        () => MOCK_DEFAULT_USERS_DATA
      );
    });

    it('Should open dialog when user clicks on data row', async () => {
      // Given
      const backdropId = 'backdrop';

      renderWithProviders(<RouterProvider router={router} />);

      const cell = await screen.findByRole('cell', {
        name: MOCK_DEFAULT_USERS_DATA.content[0].id.toString(),
      });
      const row = cell.parentElement;

      // When
      if (row) {
        fireEvent.click(row);
      }
      const backdrop = document.getElementById(backdropId);

      // Then
      expect(backdrop).not.toBeNull();
    });

    it('Should inject correct user data into dialog', async () => {
      // Given
      renderWithProviders(<RouterProvider router={router} />);

      const cell = await screen.findByRole('cell', {
        name: MOCK_DEFAULT_USERS_DATA.content[0].id.toString(),
      });
      const row = cell.parentElement;
      if (row) {
        fireEvent.click(row);
      }

      // When
      const dialog = await screen.findByRole('dialog');
      const onDialogId = await within(dialog).findByText(
        MOCK_DEFAULT_USERS_DATA.content[0].id,
        { exact: false }
      );

      // Then
      expect(onDialogId).toBeInTheDocument();
    });

    it('Should inject correct roles data into dialog', async () => {
      // Given
      renderWithProviders(<RouterProvider router={router} />);

      const cell = await screen.findByRole('cell', {
        name: MOCK_DEFAULT_USERS_DATA.content[0].id.toString(),
      });
      const row = cell.parentElement;
      if (row) {
        fireEvent.click(row);
      }

      // When
      const dialog = await screen.findByRole('dialog');
      const onDialogRoles: HTMLElement[] = [];
      for (const role of MOCK_ROLES) {
        onDialogRoles.push(await within(dialog).findByText(role.name));
      }

      // Then
      onDialogRoles.forEach((role) => {
        expect(role).toBeInTheDocument();
      });
    });

    it('Should update user data after loader data changed', async () => {
      // Given
      const mockLoader = vi.fn();
      mockLoader.mockReturnValue(MOCK_DEFAULT_USERS_DATA);
      const router = createDataRouter(path, <RolesUpdate />, mockLoader);
      renderWithProviders(<RouterProvider router={router} />);

      const cell = await screen.findByRole('cell', {
        name: MOCK_DEFAULT_USERS_DATA.content[0].id.toString(),
      });
      const row = cell.parentElement;
      if (row) {
        fireEvent.click(row);
      }

      // When
      mockLoader.mockReturnValue({
        ...MOCK_DEFAULT_USERS_DATA,
        content: [
          {
            ...MOCK_DEFAULT_USERS_DATA.content[0],
            email: 'changed@test.com',
          },
        ],
      });

      const dialog = await screen.findByRole('dialog');
      const onDialogEmail = await within(dialog).findByText(
        MOCK_DEFAULT_USERS_DATA.content[0].email,
        { exact: false }
      );

      // Then
      expect(onDialogEmail).toBeInTheDocument();
    });
  });
});
