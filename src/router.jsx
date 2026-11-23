import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import AdminDashboard from './components/admin/AdminDashboard'
import CertificateVerification from './components/verify/CertificateVerification'

const router = createBrowserRouter([
  { path: '/', element: <App initialSector="boot" /> },
  { path: '/store', element: <App initialSector="web_dev" /> },
  { path: '/products', element: <App initialSector="web_dev" /> },
  { path: '/apps', element: <App initialSector="cloud" /> },
  { path: '/clients', element: <App initialSector="client_projects" /> },
  { path: '/portfolio', element: <App initialSector="client_projects" /> },
  { path: '/projects', element: <App initialSector="client_projects" /> },
  { path: '/dashboard', element: <App initialSector="dashboard" /> },
  { path: '/mission', element: <App initialSector="mission_control" /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/verify', element: <CertificateVerification /> },
  { path: '/verify/:certificateId', element: <CertificateVerification /> },
  { path: '*', element: <App initialSector="boot" /> }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
