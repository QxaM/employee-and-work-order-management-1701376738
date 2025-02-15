import {Outlet} from 'react-router-dom';

import Footer from '../components/shared/Footer.tsx';
import useWindowSize from '../hooks/useWindowSize.tsx';
import MainNavigationHeader
  from '../components/shared/navigation/MainNavigation/MainNavigationHeader.tsx';
import MobileMainNavigation
  from '../components/shared/navigation/MainNavigation/MobileMainNavigation.tsx';
import {Size} from '../types/WindowTypes.ts';

/**
 * Renders the root page layout with responsive navigation, a content outlet, and a footer.
 *
 * - Displays `MainNavigationHeader` for non-mobile screens.
 * - Displays `MobileMainNavigation` for mobile screens (width < 768px).
 */
const RootPage = () => {
  const { width }: Partial<Size> = useWindowSize();

  const isMobile = width < 768;

  return (
    <div className="flex flex-col min-h-screen">
      {!isMobile && <MainNavigationHeader />}
      {isMobile && <MobileMainNavigation />}
      <div className="flex flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPage;
