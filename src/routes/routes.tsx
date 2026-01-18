/* eslint-disable react-refresh/only-export-components */
//React
import { lazy, Suspense } from 'react';
import { type RouteObject, Navigate } from 'react-router-dom';

//Components
import RequireRole from '../components/RequireRole';

//Pages
import Loading from '../pages/Loading';
import Error from '../pages/Error';
import Login from '../pages/Login';

//Translation
import { useTranslation } from 'react-i18next';
import Versions from '../pages/Versions';

// Lazy-loaded components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Categories = lazy(() => import('../pages/Categories'));
const Classifications = lazy(() => import('../pages/Classifications'));
const Clients = lazy(() => import('../pages/Clients'));
const Roles = lazy(() => import('../pages/Roles'));
const Vendors = lazy(() => import('../pages/Vendors'));
const Admins = lazy(() => import('../pages/Admins'));
const GiftCards = lazy(() => import('../pages/GiftCards'));
const GiftCardRequests = lazy(() => import('../pages/GiftCardRequests'))
const Stores = lazy(() => import('../pages/Stores'));
const Slider = lazy(() => import('../pages/Slider'));
const Products = lazy(() => import('../pages/Products'));
const Coupons = lazy(() => import('../pages/Coupons'));
const Orders = lazy(() => import('../pages/Orders'));
const PaymentMethods = lazy(() => import('../pages/PaymentMethods'));
const Messages = lazy(() => import('../pages/Messages'));
const PopularTopics = lazy(() => import('../pages/PopularTopics'));
const Settings = lazy(() => import('../pages/Settings'));
const Currencies = lazy(() => import('../pages/Currencies'));
const SystemInformation = lazy(() => import('../pages/SystemInformation'));
const JoinRequests = lazy(() => import('../pages/JoinRequests'));

// Helper component to handle i18n hook correctly
export function ErrorWrapper({ type, layout }: { type: 'not-found' | 'unauthorized', layout: 'default' | 'dashboard' }) {
  const { t } = useTranslation();

  return (
    <Error
      title={t(`error.${type}-title`)}
      description={t(`error.${type}-description`)}
      status={type === 'unauthorized' ? 403 : 404}
      layout={layout}
    />
  );
}

// Protected Routes
export const protectedRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: '/categories',
    element: (
      <RequireRole roles={['admin', 'vendor']}>
        <Suspense fallback={<Loading />}>
          <Categories />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/classifications',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Classifications />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/products',
    element: (
      <RequireRole roles={['vendor']}>
        <Suspense fallback={<Loading />}>
          <Products />
        </Suspense>
      </RequireRole>
    )
  },
   {
    path: '/coupons',
    element: (
      <RequireRole roles={['vendor']}>
        <Suspense fallback={<Loading />}>
          <Coupons />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/payment-methods',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <PaymentMethods />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/orders',
    element: (
      <RequireRole roles={['vendor']}>
        <Suspense fallback={<Loading />}>
          <Orders />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/gift-cards',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <GiftCards />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/gift-card-requests',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <GiftCardRequests />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/slider',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Slider />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/messages',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Messages />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/topics',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <PopularTopics />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/versions',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Versions />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/admins',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Admins />
        </Suspense>
      </RequireRole>
    ),
  },
  {
    path: '/vendors',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Vendors />
        </Suspense>
      </RequireRole>
    ),
  },
  {
    path: '/users',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Clients />
        </Suspense>
      </RequireRole>
    ),
  },
  {
    path: '/roles',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Roles />
        </Suspense>
      </RequireRole>
    ),
  },
  {
    path: '/stores',
    element: (
      <RequireRole roles={['admin', 'vendor']}>
        <Suspense fallback={<Loading />}>
          <Stores />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/settings',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Settings />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/currencies',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <Currencies />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/information',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <SystemInformation />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/join-requests',
    element: (
      <RequireRole roles={['admin']}>
        <Suspense fallback={<Loading />}>
          <JoinRequests />
        </Suspense>
      </RequireRole>
    )
  },
  {
    path: '/403',
    element: <ErrorWrapper type="unauthorized" layout='dashboard' />,
  },
   {
    path: '/404',
    element: <ErrorWrapper type="not-found" layout='dashboard' />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];

// Public Routes
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorWrapper type="not-found" layout='default' />,
  },
  {
    path: '/404',
    element: <ErrorWrapper type="not-found" layout='default' />,
  },
  {
    path: '*',
    element: <ErrorWrapper type="not-found" layout='default' />,
  },
];