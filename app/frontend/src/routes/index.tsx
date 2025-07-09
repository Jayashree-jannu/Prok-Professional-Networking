import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import Feed from '../components/feed/Feed';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function ErrorFallback() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Something went wrong!</h1>
      <p>Sorry, an unexpected error occurred. Please try again or contact support.</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
}

// @ts-ignore: v7_startTransition is a valid runtime flag in react-router-dom v7, but types may lag behind
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <Feed />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <ProfileView />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '/profile/edit',
    element: (
      <RequireAuth>
        <ProfileEdit />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '/jobs',
    element: (
      <RequireAuth>
        <JobList />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '/messages',
    element: (
      <RequireAuth>
        <MessageList />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />,
  },
]);

export default router; 