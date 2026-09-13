import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading, error } = useSelector((state) => state.feed);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    dispatch(fetchFeeds());

    dispatch({
      type: 'socket/connect',
      payload: {
        url: 'wss://norma.education-services.ru/api/orders/all'
      }
    });

    return () => {
      dispatch({
        type: 'socket/disconnect'
      });
    };
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
