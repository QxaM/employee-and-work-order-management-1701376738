import SelectableField from '../../shared/SelectableField.tsx';
import { RoleType } from '../../../types/RoleTypes.ts';

interface RolesListSectionProps {
  title: string;
  roles: RoleType[];
  selectedRole: RoleType | null;
  onRoleClick: (role: RoleType) => void;
}

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
