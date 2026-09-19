import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Building2,
  Users,
  FolderOpen,
  HardHat,
  FileStack,
  LayoutTemplate,
  Printer,
  Package,
  ShieldAlert,
  Radio,
  Activity,
  Footprints,
  Ruler,
  Zap,
  ClipboardCheck,
  Truck,
  FileSignature,
  ClipboardList as ClipboardListIcon,
  GraduationCap,
  FolderKanban,
  FileType2,
  Images,
  Image,
  Route,
  CheckSquare,
  PenTool,
  Settings,
} from 'lucide-react'

export const NAV_SECTIONS = [
  {
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Permits & Allocations',
    items: [
      { to: '/permits', label: 'Permits', icon: FileText },
      { to: '/allocations', label: 'Allocations', icon: ClipboardList },
      { to: '/ground-disturbance-permits', label: 'Ground Disturbance & Specialist', icon: HardHat },
      { to: '/item-packs', label: 'Item Packs', icon: Package },
      { to: '/permit-templates', label: 'Permit Templates', icon: FileStack },
      { to: '/allocation-templates', label: 'Allocation Templates', icon: LayoutTemplate },
      { to: '/allocation-print-templates', label: 'Allocation Print Templates', icon: Printer },
    ],
  },
  {
    label: 'Safety & Compliance',
    items: [
      { to: '/engineer/powra', label: 'POWRA', icon: ShieldAlert },
      { to: '/engineer/gs6', label: 'GS6 Register', icon: Radio },
      { to: '/engineer/havs', label: 'HAVS Register', icon: Activity },
      { to: '/engineer/line-walks', label: 'Line Walks', icon: Footprints },
      { to: '/engineer/conductor-heights', label: 'Conductor Heights', icon: Ruler },
      { to: '/engineer/plant-clearance', label: 'Plant Clearance', icon: Zap },
      { to: '/engineer/pre-use-checks', label: 'Pre-Use Checks', icon: ClipboardCheck },
      { to: '/engineer/plant-equipment', label: 'Plant & Equipment', icon: Truck },
      { to: '/engineer/pass-forms', label: 'PASS Form Log', icon: ClipboardListIcon },
      { to: '/engineer/pass-templates', label: 'PASS Templates', icon: FileSignature },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/contractors', label: 'Contractors', icon: Building2 },
      { to: '/contacts', label: 'Site Contacts', icon: Users },
      { to: '/trainees', label: 'Trainees', icon: GraduationCap },
    ],
  },
  {
    label: 'Documents',
    items: [
      { to: '/documents', label: 'Documents', icon: FolderOpen },
      { to: '/document-groups', label: 'Document Groups', icon: FolderKanban },
      { to: '/engineer/pdf-forms', label: 'PDF Forms', icon: FileType2 },
      { to: '/engineer/photo-archive', label: 'Photo Archive', icon: Images },
      { to: '/engineer/map-routes', label: 'Map Routes', icon: Route },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/engineer/todos', label: 'To-Do List', icon: CheckSquare },
      { to: '/engineer/signatures', label: 'Saved Signatures', icon: PenTool },
    ],
  },
  {
    label: 'Admin',
    items: [
      { to: '/admin/settings', label: 'Admin Settings', icon: Settings },
      { to: '/admin/images', label: 'Image Library', icon: Image },
    ],
  },
]

// Flat list kept for places that just need "all routes" (e.g. mobile drawer close-on-navigate).
export const NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items)
