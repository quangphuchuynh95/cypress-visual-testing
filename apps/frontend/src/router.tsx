import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import BranchScreenshotsPage from './pages/branch-screenshots-page.tsx';
import ComingSoonPage from './pages/coming-soon-page.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <ComingSoonPage />,
      },
      {
        path: '/screenshot',
        element: <ComingSoonPage />,
      },
      {
        path: '/branch-screenshot',
        element: <BranchScreenshotsPage />,
      },
    ],
  },
]);
