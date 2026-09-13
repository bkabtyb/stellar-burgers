import { Middleware } from '@reduxjs/toolkit';

import { setFeedData } from '../slices/feedSlice';
import { setProfileOrders } from '../slices/profileOrdersSlice';

type SocketAction = {
  type: string;
  payload?: {
    url?: string;
  };
};

const sockets: Record<string, WebSocket | null> = {
  feed: null,
  profile: null
};

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const socketAction = action as SocketAction;

  if (
    socketAction.type === 'socket/connect' ||
    socketAction.type === 'socket/connect-profile'
  ) {
    const url = socketAction.payload?.url;

    if (!url) {
      return next(action);
    }

    const socketName =
      socketAction.type === 'socket/connect-profile' ? 'profile' : 'feed';

    const currentSocket = sockets[socketName];

    if (
      currentSocket &&
      (currentSocket.readyState === WebSocket.OPEN ||
        currentSocket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const socket = new WebSocket(url);

    sockets[socketName] = socket;

    socket.onopen = () => {};

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.success && Array.isArray(data.orders)) {
          if (socketName === 'profile') {
            store.dispatch(
              setProfileOrders({
                orders: data.orders
              })
            );
          } else {
            store.dispatch(setFeedData(data));
          }
        }
      } catch {
        console.error('Ошибка обработки WebSocket-сообщения');
      }
    };

    socket.onerror = (event) => {
      console.error(`Ошибка WebSocket ${socketName}`, event);
    };

    socket.onclose = () => {
      if (sockets[socketName] === socket) {
        sockets[socketName] = null;
      }
    };

    return;
  }

  if (
    socketAction.type === 'socket/disconnect' ||
    socketAction.type === 'socket/disconnect-profile'
  ) {
    const socketName =
      socketAction.type === 'socket/disconnect-profile' ? 'profile' : 'feed';

    const socket = sockets[socketName];

    if (socket) {
      socket.close();
      sockets[socketName] = null;
    }

    return;
  }

  return next(action);
};
