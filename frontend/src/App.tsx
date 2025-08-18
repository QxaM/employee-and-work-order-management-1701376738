import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import RootPage from './pages/RootPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
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
import ProtectedRoute from './components/shared/ProtectedRoute.tsx';
import ErrorElement from './components/shared/router/ErrorElement.tsx';
import ModalProvider from './components/shared/modal/ModalProvider.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <></> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/confirm', element: <RegisterConfirmationPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/password/request', element: <PasswordRequestPage /> },
      { path: '/password/confirm', element: <PasswordUpdatePage /> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminPage /> },
          {
            path: 'roles-update',
            element: <RolesUpdate />,
            errorElement: <ErrorElement />,
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
    <Provider store={store}>
      <ModalProvider>
        <RouterProvider router={router} />
        <DialogManager />
      </ModalProvider>
    </Provider>
  );
}

export default App;
