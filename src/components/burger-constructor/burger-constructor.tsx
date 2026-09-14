import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { createOrder, clearOrder } from '../../services/slices/orderSlice';

import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const orderRequest = useSelector((state) => state.order.isLoading);

  const orderModalData = useSelector((state) => state.order.order);

  const orderError = useSelector((state) => state.order.error);

  useEffect(
    () => () => {
      dispatch(clearOrder());
    },
    [dispatch]
  );

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    const result = await dispatch(createOrder(ingredients));

    if (createOrder.fulfilled.match(result)) {
      dispatch(clearConstructor());
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
