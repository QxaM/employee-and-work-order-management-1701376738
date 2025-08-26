import { afterEach, beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import RolesUpdatePage from '../../../src/pages/admin/RolesUpdatePage.tsx';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { GetUsersType } from '../../../src/types/api/UserTypes.ts';
import { createDataRouter, renderWithProviders } from '../../test-utils.tsx';
import * as roleSlice from '../../../src/store/api/role.ts';
import * as userSlice from '../../../src/store/api/user.ts';
import { RoleType } from '../../../src/types/api/RoleTypes.ts';

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

describe('RolesUpdatePage', () => {
  let router: ReturnType<typeof createDataRouter>;

  const mockUsersData = {
    data: MOCK_DEFAULT_USERS_DATA,
    isSuccess: true,
    isFetching: false,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
  };

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

    vi.spyOn(userSlice, 'useGetUsersQuery').mockReturnValue(mockUsersData);
    vi.spyOn(roleSlice, 'useGetRolesQuery').mockReturnValue(mockRoleData);

    router = createDataRouter(path, <RolesUpdatePage />, () => ({
      content: [],
    }));
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

      const router = createDataRouter(path, <RolesUpdatePage />, mockLoader);
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
      vi.spyOn(userSlice, 'useGetUsersQuery').mockReturnValue({
        data: mockPageData,
        isSuccess: true,
        isError: false,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const router = createDataRouter(path, <RolesUpdatePage />, mockLoader);
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

  describe('Loader data render', () => {
    let router: ReturnType<typeof createMemoryRouter>;

    beforeEach(() => {
      router = createDataRouter(
        path,
        <RolesUpdatePage />,
        () => MOCK_DEFAULT_USERS_DATA
      );
    });

    it('Should render user content', async () => {
      // Given
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const userId = await screen.findByText(
        MOCK_DEFAULT_USERS_DATA.content[0].id,
        { exact: false }
      );

      // Then
      expect(userId).toBeInTheDocument();
    });

    it('Should render roles content', async () => {
      // Given
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const rolesElements: HTMLElement[] = [];
      for (const role of MOCK_ROLES) {
        rolesElements.push(await screen.findByText(role.name));
      }

      // Then
      rolesElements.forEach((role) => {
        expect(role).toBeInTheDocument();
      });
    });
  });
});
