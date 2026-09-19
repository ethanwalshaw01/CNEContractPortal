import { NavLink } from 'react-router-dom'
import { Zap, X } from 'lucide-react'
import { NAV_ITEMS } from './navConfig'
import { cn } from '@/lib/utils'

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-white shadow-inner'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white'
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function SidebarBrand() {
  return (
    <div className="flex h-16 items-center gap-2.5 px-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
        <Zap className="h-5 w-5" fill="currentColor" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">CNE Contract Portal</p>
        <p className="text-[11px] text-sidebar-foreground/70">Permits &amp; Allocations</p>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarBrand />
      <NavItems />
    </aside>
  )
}

export function MobileSidebar({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-sidebar shadow-panel animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between">
          <SidebarBrand />
          <button
            onClick={onClose}
            className="mr-4 rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavItems onNavigate={onClose} />
      </aside>
    </div>
  )
}
