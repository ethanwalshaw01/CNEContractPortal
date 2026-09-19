import { Link } from 'react-router-dom'
import { FileText, ClipboardList, Building2, PlusCircle, ArrowRight, FolderPlus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatCard from '@/components/common/StatCard'
import StatusBadge from '@/components/common/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/AuthContext'
import { useDashboardStats, useRecentActivity } from '@/hooks/useDashboardStats'
import { formatDateTime } from '@/lib/utils'

const QUICK_ACTIONS = [
  { to: '/permits/new', label: 'New permit', icon: FileText },
  { to: '/allocations/new', label: 'New allocation', icon: ClipboardList },
  { to: '/contractors?new=1', label: 'Add contractor', icon: Building2 },
  { to: '/documents', label: 'Upload document', icon: FolderPlus },
]

export default function Dashboard() {
  const { profile } = useAuth()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: activity, isLoading: activityLoading } = useRecentActivity()

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <div>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : 'Dashboard'}
        description="Here's what's happening across your permits and allocations today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Live permits" value={stats?.livePermits} icon={FileText} tone="success" loading={statsLoading} />
        <StatCard label="Issued permits" value={stats?.issuedPermits} icon={FileText} tone="primary" loading={statsLoading} />
        <StatCard
          label="Pending allocations"
          value={stats?.pendingAllocations}
          icon={ClipboardList}
          tone="warning"
          loading={statsLoading}
        />
        <StatCard label="Active contractors" value={stats?.contractors} icon={Building2} tone="accent" loading={statsLoading} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : activity?.length ? (
              <ul className="divide-y divide-border">
                {activity.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      to={item.type === 'permit' ? `/permits/${item.id}` : `/allocations/${item.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/50 -mx-2 px-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                          {item.type === 'permit' ? <FileText className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.number} · {formatDateTime(item.created_at)}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No activity yet"
                description="Permits and allocations you create will show up here."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
              <Button key={to} variant="outline" asChild className="w-full justify-between">
                <Link to={to}>
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            ))}
            <Button asChild className="w-full mt-1">
              <Link to="/permits">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                View permit register
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
