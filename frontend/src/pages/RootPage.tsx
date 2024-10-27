import { Outlet } from 'react-router-dom';

import MainNavigationHeader from '../components/shared/navigation/MainNavigationHeader.tsx';

const RootPage = () => {
  return (
    <>
      <MainNavigationHeader />
      <Outlet />
    </>
  );
};

export default RootPage;
