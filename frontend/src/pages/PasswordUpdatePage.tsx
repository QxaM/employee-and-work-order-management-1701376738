import PasswordUpdateForm from '../components/PasswordUpdateForm.tsx';
import {useSearchParams} from 'react-router-dom';

/**
 * Renders the Password Update Page that contain `PasswordUpdateForm`. It will be rendered
 * after navigating to /password/confirm.
 */
const PasswordUpdatePage = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <main className="flex flex-col p-2 justify-center lg:w-1/3 w-2/3 rounded border border-qxam-accent-lightest bg-qxam-primary-extreme-light">
        <PasswordUpdateForm token={searchParams.get('token') ?? ''} />
      </main>
    </div>
  );
};

export default PasswordUpdatePage;
