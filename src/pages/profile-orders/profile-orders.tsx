import { FC, useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading, error } = useSelector(
    (state) => state.profileOrders
  );

  useEffect(() => {
    dispatch(fetchProfileOrders());

    const accessToken = getCookie('accessToken');

    if (accessToken) {
      dispatch({
        type: 'socket/connect-profile',
        payload: {
          url: `wss://norma.education-services.ru/api/orders?token=${accessToken}`
        }
      });
    }

    return () => {
      dispatch({
        type: 'socket/disconnect-profile'
      });
    };
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
