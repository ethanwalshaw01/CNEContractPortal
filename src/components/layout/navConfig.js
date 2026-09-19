import { LayoutDashboard, FileText, ClipboardList, Building2, Users, FolderOpen } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/permits', label: 'Permits', icon: FileText },
  { to: '/allocations', label: 'Allocations', icon: ClipboardList },
  { to: '/contractors', label: 'Contractors', icon: Building2 },
  { to: '/contacts', label: 'Site Contacts', icon: Users },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
]
