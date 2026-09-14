import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
