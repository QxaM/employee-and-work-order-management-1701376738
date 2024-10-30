import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootPage from './pages/RootPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [{ index: true, element: <>Test content</> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
