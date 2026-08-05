import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import { HomePage } from '@/pages/home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <HomePage /> }],
  },
])
