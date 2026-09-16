import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

type TAuthorizedRouteProps = {
  children: ReactElement;
};

export const AuthorizedRoute: FC<TAuthorizedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';

    return <Navigate to={from} replace />;
  }

  return children;
};
