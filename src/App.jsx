import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import RouteError from './pages/RouteError'
import Shop from './pages/Shop'

const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Orders = lazy(() => import('./pages/Orders'))

const deferred = (Page) => (
  <Suspense fallback={<div className="min-h-[70vh]" />}>
    <Page />
  </Suspense>
)

// Shown while a lazily loaded route's code downloads on the first page load.
const booting = <div className="min-h-svh" />

const adminRoutes = {
  path: '/admin',
  errorElement: <RouteError />,
  hydrateFallbackElement: booting,
  lazy: () => import('./admin/AdminLayout'),
  children: [
    { index: true, lazy: () => import('./admin/Products') },
    { path: 'products/new', lazy: () => import('./admin/ProductForm') },
    { path: 'products/:id', lazy: () => import('./admin/ProductForm') },
    { path: 'categories', lazy: () => import('./admin/Taxonomy').then((m) => ({ Component: m.Categories })) },
    { path: 'collections', lazy: () => import('./admin/Taxonomy').then((m) => ({ Component: m.Collections })) },
    { path: 'settings', lazy: () => import('./admin/Settings') },
    { path: 'account', lazy: () => import('./admin/Account') },
  ],
}

const router = createBrowserRouter([
  { path: '/admin/login', errorElement: <RouteError />, hydrateFallbackElement: booting, lazy: () => import('./admin/Login') },
  adminRoutes,
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/shop/:category', element: <Shop /> },
      { path: '/product/:slug', element: <Product /> },
      { path: '/about', element: deferred(About) },
      { path: '/contact', element: deferred(Contact) },
      { path: '/shipping-and-orders', element: deferred(Orders) },
      { path: '/404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
