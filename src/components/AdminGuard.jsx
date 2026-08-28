import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../store';


export default function AdminGuard({ children }) {
  const [ready] = useState(true);
  const [authed] = useState(isAdmin());

  useEffect(() => {
  }, []);

  if (!ready) return null;
  if (!authed) return <Navigate to="/admin" replace />;
  return children;
}