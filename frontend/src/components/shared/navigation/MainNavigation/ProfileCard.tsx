import { useMeData } from '../../../../hooks/useMeData.tsx';

const ProfileCard = () => {
  const cardClasses =
    'mr-2 min-h-11 aspect-square ' +
    'cursor-pointer rounded ' +
    'bg-qxam-primary-lightest text-qxam-primary-darker font-black' +
    'text-center text-2xl uppercase ' +
    'shadow shadow-qxam-primary-lightest/50 ' +
    'flex justify-center items-center ' +
    'hover:shadow-md hover:shadow-qxam-primary-lightest/75 ' +
    'hover:border-2 hover:border-qxam-primary';

  const { me } = useMeData();

  const firstLetter = me?.email.charAt(0);

  return (
    <button
      className={cardClasses}
      data-testid="profile-card"
      aria-label="profile"
    >
      {firstLetter && <span aria-hidden="true">{firstLetter}</span>}
    </button>
  );
};

export default ProfileCard;
