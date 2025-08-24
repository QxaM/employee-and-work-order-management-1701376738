import { RoleType } from '../../../types/api/RoleTypes.ts';
import { Flex, Heading, Section } from '@radix-ui/themes';
import { ToggleGroup } from 'radix-ui';

interface RolesListSectionProps {
  title: string;
  roles: RoleType[];
}

/**
 * A React functional component that renders a section displaying a list of roles as selectable items.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title to be displayed for the roles list section.
 * @param {Array<Object>} props.roles - An array of role objects to be displayed within the section. Each role object should contain an `id` and `name` property.
 */
const RolesListSection = ({ title, roles }: RolesListSectionProps) => {
  const roleButtonClass =
    'flex justify-center items-center w-full py-1 rounded shadow-violet-6 shadow-[0_0_0_1px]' +
    ' hover:bg-violet-3 focus:shadow-[0_0_0_1px] focus:shadow-violet-9 focus:outline-none' +
    ' data-[state=on]:bg-violet-6 data-[state=on]:text-violet-12';
  const headerId = `roles-header-${title.replaceAll(' ', '')}`;

  return (
    <Section
      aria-labelledby={headerId}
      className="border border-(--violet-a11) rounded"
      asChild
    >
      <Flex direction="column" gap="4" p="2" flexGrow="1" width="100%">
        <Heading
          as="h4"
          id={headerId}
          size="2"
          weight="bold"
          className="uppercase"
        >
          {title}
        </Heading>
        <Flex direction="column" gap="3" px="6" justify="center" align="center">
          {roles.map((role) => (
            <ToggleGroup.Item
              key={role.id}
              value={role.name}
              className={roleButtonClass}
            >
              {role.name}
            </ToggleGroup.Item>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
};

export default RolesListSection;
