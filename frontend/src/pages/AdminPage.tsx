import AdminSidebar from '../components/shared/navigation/AdminSidebar.tsx';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="flex flex-row flex-grow">
      <AdminSidebar />
      <main className="flex items-center justify-center w-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
