import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootPage from './pages/RootPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <></> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
