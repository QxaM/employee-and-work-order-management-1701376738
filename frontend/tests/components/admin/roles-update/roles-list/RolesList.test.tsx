import { RoleType } from '../../../../../src/types/api/RoleTypes.ts';
import RolesList from '../../../../../src/components/admin/roles-update/roles-list/RolesList.tsx';
import { render, screen } from '@testing-library/react';

const TITLE = 'Test title';
const ROLES: RoleType[] = [
  {
    id: 1,
    name: 'OPERATOR',
  },
  {
    id: 2,
    name: 'DESIGNER',
  },
  {
    id: 3,
    name: 'ADMIN',
  },
  {
    id: 4,
    name: 'TEST',
  },
];

describe('RolesList', () => {
  it('Should render title', () => {
    // Given
    render(<RolesList title={TITLE} roles={ROLES} />);

    // When
    const titleElement = screen.getByText(`${TITLE}:`);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render roles', () => {
    // Given
    render(<RolesList title={TITLE} roles={ROLES} />);

    // When
    const roleElements = ROLES.map((role) => screen.getByText(role.name));

    // Then
    expect(roleElements).toHaveLength(ROLES.length);
    roleElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it('Should render default button if no renderAction is provided', () => {
    // Given
    render(<RolesList title={TITLE} roles={ROLES} />);

    // When
    const buttons = screen.queryAllByRole('button');

    // Then
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('Should render custom renderAction', () => {
    // Given
    const renderAction = (role: RoleType) => <p>{role.name}</p>;
    render(
      <RolesList title={TITLE} roles={ROLES} renderAction={renderAction} />
    );

    // When
    const paragraphs = screen.queryAllByRole('paragraph');

    // Then
    expect(paragraphs.length).toBeGreaterThan(0);
  });
});
