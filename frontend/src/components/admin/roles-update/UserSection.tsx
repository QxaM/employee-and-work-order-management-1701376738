import DisplayField from '../../shared/DisplayField.tsx';

interface UserSectionProps {
  title: string;
  userId: number;
  email: string;
}

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
