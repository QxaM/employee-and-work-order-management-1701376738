import SelectableField from '../../shared/SelectableField.tsx';
import { RoleType } from '../../../types/RoleTypes.ts';

interface RolesListSectionProps {
  title: string;
  roles: RoleType[];
  selectedRole: RoleType | null;
  onRoleClick: (role: RoleType) => void;
}

/**
 * A React functional component that renders a section displaying a list of roles as selectable items.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title to be displayed for the roles list section.
 * @param {Array<Object>} props.roles - An array of role objects to be displayed within the section. Each role object should contain an `id` and `name` property.
 * @param {Object|null} props.selectedRole - The currently selected role object, or null if no role is selected.
 * @param {Function} props.onRoleClick - A callback function invoked when a role is clicked, passing the clicked role object as an argument.
 */
const RolesListSection = ({
  title,
  roles,
  selectedRole,
  onRoleClick,
}: RolesListSectionProps) => {
  const rolesContainerClass =
    'flex flex-col gap-2 px-8 justify-center items-center';
  const roleButtonClass = 'w-full';
  const headerId = `roles-header-${title.replaceAll(' ', '')}`;

  return (
    <section
      aria-labelledby={headerId}
      className="flex flex-col gap-4 p-2 border border-qxam-primary-lighter rounded"
    >
      <h4 id={headerId} className="font-bold text-sm uppercase">
        {title}
      </h4>
      <div className={rolesContainerClass}>
        {roles.map((role) => (
          <SelectableField
            key={role.id}
            value={role.name}
            isSelected={role.id === selectedRole?.id}
            onClick={() => {
              onRoleClick(role);
            }}
            className={roleButtonClass}
          />
        ))}
      </div>
    </section>
  );
};

export default RolesListSection;
