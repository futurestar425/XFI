import { lazy } from 'react';

const Vault = lazy(() => import('../pages/Vault'));
const Swap = lazy(() => import('../pages/Swap'));
const Earn = lazy(() => import('../pages/Earn'));
const Liquidity = lazy(() => import('../pages/Liquidity'));

const coreRoutes = [
  {
    path: '/swap',
    title: 'Swap',
    component: Swap,
  },
  {
    path: '/vault',
    title: 'Vault',
    component: Vault,
  },
  {
    path: '/earn',
    title: 'earn',
    component: Earn,
  },
  {
    path: '/liquidity',
    title: 'liquidity',
    component: Liquidity,
  },
];

const routes = [...coreRoutes];
export default routes;
