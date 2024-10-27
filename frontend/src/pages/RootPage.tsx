import { Outlet } from 'react-router-dom';

import MainNavigationHeader from '../components/shared/navigation/MainNavigationHeader.tsx';
import Footer from '../components/shared/Footer.tsx';
import useWindowSize from '../hooks/useWindowSize.tsx';

const RootPage = () => {
  const { width } = useWindowSize();

  const isMobile = width < 768;

  return (
    <div className="flex flex-col min-h-screen">
      {!isMobile && <MainNavigationHeader />}
      {isMobile && <Footer />}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;
