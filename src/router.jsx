import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App'
import NotFound from './components/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    // Direct link to the store — skips boot and goes straight to webdev_store scene
    path: '/store',
    element: <App initialScene="webdev_store" />
  },
  {
    // Direct link to HQ orbital sphere
    path: '/hq',
    element: <App initialScene="headquarters" />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
