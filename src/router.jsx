import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
