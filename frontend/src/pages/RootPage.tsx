import { Outlet } from 'react-router-dom';

import MainNavigationHeader from '../components/shared/navigation/MainNavigationHeader.tsx';
import Footer from '../components/shared/Footer.tsx';

const RootPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigationHeader />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;
