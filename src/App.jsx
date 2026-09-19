import { Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppShell from '@/components/layout/AppShell'
import ScrollToTop from '@/components/ScrollToTop'

import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

import PermitRegister from '@/pages/permits/PermitRegister'
import PermitForm from '@/pages/permits/PermitForm'
import PermitDetail from '@/pages/permits/PermitDetail'

import AllocationRegister from '@/pages/allocations/AllocationRegister'
import AllocationBuilder from '@/pages/allocations/AllocationBuilder'
import AllocationDetail from '@/pages/allocations/AllocationDetail'
import AllocationAccept from '@/pages/allocations/AllocationAccept'

import Contractors from '@/pages/Contractors'
import SiteContacts from '@/pages/SiteContacts'
import DocumentLibrary from '@/pages/DocumentLibrary'
import MyAccount from '@/pages/MyAccount'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/allocations/:id/accept" element={<AllocationAccept />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/permits" element={<PermitRegister />} />
            <Route path="/permits/new" element={<PermitForm />} />
            <Route path="/permits/:id" element={<PermitDetail />} />
            <Route path="/permits/:id/edit" element={<PermitForm />} />

            <Route path="/allocations" element={<AllocationRegister />} />
            <Route path="/allocations/new" element={<AllocationBuilder />} />
            <Route path="/allocations/:id" element={<AllocationDetail />} />
            <Route path="/allocations/:id/edit" element={<AllocationBuilder />} />

            <Route path="/contractors" element={<Contractors />} />
            <Route path="/contacts" element={<SiteContacts />} />
            <Route path="/documents" element={<DocumentLibrary />} />
            <Route path="/account" element={<MyAccount />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
