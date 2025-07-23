import DisplayField from '../../shared/DisplayField.tsx';

interface UserSectionProps {
  title: string;
  userId: number;
  email: string;
}

/**
 * Renders a user section component with a title, user ID, and email information.
 *
 * This component is structured as a section element, containing a heading
 * for the title and display fields for showing the user ID and email
 *
 * @param {Object} props - The component's props object.
 * @param {string} props.title - The title of the section.
 * @param {string} props.userId - The unique identifier of the user.
 * @param {string} props.email - The email address of the user.
 *
 * @returns {JSX.Element} The rendered user section component.
 */
const UserSection = ({ title, userId: id, email }: UserSectionProps) => {
  return (
    <section
      aria-labelledby="roles-update-user-data"
      className="flex flex-col gap-1 p-2 border border-qxam-primary-lighter rounded"
    >
      <h4 id="roles-update-user-data" className="font-bold text-sm uppercase">
        {title}
      </h4>
      <DisplayField
        title="User ID"
        value={id}
        orientation="horizontal"
        className="mx-2"
      />
      <DisplayField
        title="User email"
        value={email}
        orientation="horizontal"
        className="mx-2"
      />
    </section>
  );
};

export default UserSection;
