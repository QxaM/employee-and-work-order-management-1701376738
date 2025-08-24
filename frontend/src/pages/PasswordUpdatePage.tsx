import PasswordUpdateForm from '../components/PasswordUpdateForm.tsx';
import { useSearchParams } from 'react-router-dom';
import BasePage from './base/BasePage.tsx';

/**
 * Renders the Password Update Page that contain `PasswordUpdateForm`. It will be rendered
 * after navigating to /password/confirm.
 */
const PasswordUpdatePage = () => {
  const [searchParams] = useSearchParams();

  return (
    <BasePage>
      <PasswordUpdateForm token={searchParams.get('token') ?? ''} />
    </BasePage>
  );
};

export default PasswordUpdatePage;
