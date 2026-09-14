import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  ProtectedRoute,
  AuthorizedRoute,
  OrderInfo
} from '@components';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { getUser, authChecked } from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const {
    ingredients,
    isLoading: isIngredientsLoading,
    error
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length === 0 ? (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />

            <Route
              path='/login'
              element={
                <AuthorizedRoute>
                  <Login />
                </AuthorizedRoute>
              }
            />

            <Route
              path='/register'
              element={
                <AuthorizedRoute>
                  <Register />
                </AuthorizedRoute>
              }
            />

            <Route
              path='/forgot-password'
              element={
                <AuthorizedRoute>
                  <ForgotPassword />
                </AuthorizedRoute>
              }
            />

            <Route
              path='/reset-password'
              element={
                <AuthorizedRoute>
                  <ResetPassword />
                </AuthorizedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title='' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>
          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={() => navigate(-1)}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />

              <Route
                path='/feed/:number'
                element={
                  <Modal title='' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />

              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title='' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
