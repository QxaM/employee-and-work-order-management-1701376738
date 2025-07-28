import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import RootPage from './pages/RootPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { queryClient } from './api/base.ts';
import { Provider } from 'react-redux';
import { store } from './store';
import DialogManager from './components/DialogManager.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterConfirmationPage from './pages/RegisterConfirmationPage.tsx';
import PasswordRequestPage from './pages/PasswordRequestPage.tsx';
import PasswordUpdatePage from './pages/PasswordUpdatePage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import RolesUpdate from './components/admin/roles-update/RolesUpdate.tsx';
import { loadUsers } from './api/loaders/user.loader.ts';
import { updateRoles } from './api/actions/user.action.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <></> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/confirm', element: <RegisterConfirmationPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/password/request', element: <PasswordRequestPage /> },
      { path: '/password/confirm', element: <PasswordUpdatePage /> },
      {
        path: '/admin',
        element: <AdminPage />,
        children: [
          { index: true, element: <></> },
          {
            path: 'roles-update',
            element: <RolesUpdate />,
            loader: (loaderFunctionArgs) =>
              loadUsers(store, loaderFunctionArgs),
            action: (loaderFunctionArgs) =>
              updateRoles(store, loaderFunctionArgs),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <DialogManager />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
