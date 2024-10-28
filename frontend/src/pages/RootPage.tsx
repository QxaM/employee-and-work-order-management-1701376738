import { Outlet } from 'react-router-dom';

import Footer from '../components/shared/Footer.tsx';
import useWindowSize from '../hooks/useWindowSize.tsx';
import MainNavigationHeader from '../components/shared/navigation/MainNavigation/MainNavigationHeader.tsx';
import MobileMainNavigation from '../components/shared/navigation/MainNavigation/MobileMainNavigation.tsx';

const RootPage = () => {
  const { width } = useWindowSize();

  const isMobile = width < 768;

  return (
    <div className="flex flex-col min-h-screen">
      {!isMobile && <MainNavigationHeader />}
      {isMobile && <MobileMainNavigation />}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;
