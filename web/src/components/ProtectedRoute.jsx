import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (user.role === 'MANAGER' && !user.isApproved && window.location.pathname !== '/pending-approval') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
