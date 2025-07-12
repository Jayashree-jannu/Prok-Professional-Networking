import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import Feed from '../components/feed/Feed';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';
import PostList from '../components/posts/PostList';
import PostCreate from '../components/posts/PostCreate';
import Layout from '../components/navigation/Layout';

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
        <Layout />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />,
    children: [
      { path: '/', element: <Feed /> },
      { path: '/profile', element: <ProfileView /> },
      { path: '/profile/edit', element: <ProfileEdit /> },
      { path: '/jobs', element: <JobList /> },
      { path: '/messages', element: <MessageList /> },
      { path: '/posts', element: <PostList /> },
      { path: '/posts/create', element: <PostCreate /> },
    ],
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
]); 

export { router }; 