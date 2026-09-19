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
import ContractorDetail from '@/pages/ContractorDetail'
import SiteContacts from '@/pages/SiteContacts'
import DocumentLibrary from '@/pages/DocumentLibrary'
import MyAccount from '@/pages/MyAccount'

import GroundDisturbanceRegister from '@/pages/GroundDisturbanceRegister'
import ItemPackRegister from '@/pages/ItemPackRegister'
import PermitTemplateRegister from '@/pages/PermitTemplateRegister'
import AllocationTemplateRegister from '@/pages/AllocationTemplateRegister'
import AllocationPrintTemplateRegister from '@/pages/AllocationPrintTemplateRegister'
import DocumentGroupRegister from '@/pages/DocumentGroupRegister'
import TraineeRegister from '@/pages/TraineeRegister'
import TraineeDetail from '@/pages/TraineeDetail'
import AdminSettings from '@/pages/AdminSettings'
import AdminLibraryImages from '@/pages/AdminLibraryImages'

import PowraRegister from '@/pages/engineer/PowraRegister'
import Gs6Register from '@/pages/engineer/Gs6Register'
import HavsRegister from '@/pages/engineer/HavsRegister'
import LineWalkLog from '@/pages/engineer/LineWalkLog'
import ConductorHeightLog from '@/pages/engineer/ConductorHeightLog'
import PlantClearanceLogPage from '@/pages/engineer/PlantClearanceLogPage'
import PreUseCheckLog from '@/pages/engineer/PreUseCheckLog'
import PlantEquipmentPage from '@/pages/engineer/PlantEquipmentPage'
import PassFormLogRegister from '@/pages/engineer/PassFormLogRegister'
import PassFormTemplateRegister from '@/pages/engineer/PassFormTemplateRegister'
import PdfFormRegister from '@/pages/engineer/PdfFormRegister'
import PhotoArchivePage from '@/pages/engineer/PhotoArchivePage'
import MapRoutesPage from '@/pages/engineer/MapRoutesPage'
import TodoListPage from '@/pages/engineer/TodoListPage'
import SavedSignaturesPage from '@/pages/engineer/SavedSignaturesPage'

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

            <Route path="/ground-disturbance-permits" element={<GroundDisturbanceRegister />} />
            <Route path="/item-packs" element={<ItemPackRegister />} />
            <Route path="/permit-templates" element={<PermitTemplateRegister />} />
            <Route path="/allocation-templates" element={<AllocationTemplateRegister />} />
            <Route path="/allocation-print-templates" element={<AllocationPrintTemplateRegister />} />

            <Route path="/contractors" element={<Contractors />} />
            <Route path="/contractors/:id" element={<ContractorDetail />} />
            <Route path="/contacts" element={<SiteContacts />} />
            <Route path="/trainees" element={<TraineeRegister />} />
            <Route path="/trainees/:id" element={<TraineeDetail />} />

            <Route path="/documents" element={<DocumentLibrary />} />
            <Route path="/document-groups" element={<DocumentGroupRegister />} />
            <Route path="/account" element={<MyAccount />} />

            <Route path="/engineer/powra" element={<PowraRegister />} />
            <Route path="/engineer/gs6" element={<Gs6Register />} />
            <Route path="/engineer/havs" element={<HavsRegister />} />
            <Route path="/engineer/line-walks" element={<LineWalkLog />} />
            <Route path="/engineer/conductor-heights" element={<ConductorHeightLog />} />
            <Route path="/engineer/plant-clearance" element={<PlantClearanceLogPage />} />
            <Route path="/engineer/pre-use-checks" element={<PreUseCheckLog />} />
            <Route path="/engineer/plant-equipment" element={<PlantEquipmentPage />} />
            <Route path="/engineer/pass-forms" element={<PassFormLogRegister />} />
            <Route path="/engineer/pass-templates" element={<PassFormTemplateRegister />} />
            <Route path="/engineer/pdf-forms" element={<PdfFormRegister />} />
            <Route path="/engineer/photo-archive" element={<PhotoArchivePage />} />
            <Route path="/engineer/map-routes" element={<MapRoutesPage />} />
            <Route path="/engineer/todos" element={<TodoListPage />} />
            <Route path="/engineer/signatures" element={<SavedSignaturesPage />} />

            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/images" element={<AdminLibraryImages />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
