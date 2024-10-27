import { Outlet } from 'react-router-dom';

const RootPage = () => {
  return (
    <div className="text-qxam-primary">
      Test Page
      <Outlet />
    </div>
  );
};

export default RootPage;
