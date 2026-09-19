import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, Plus, MapPin } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import StatusBadge from '@/components/common/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAllocations } from '@/hooks/useAllocations'
import { formatDate, titleCase } from '@/lib/utils'

const TABS = ['all', 'draft', 'pending_acceptance', 'accepted', 'live', 'completed', 'archived']

export default function AllocationRegister() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { data: allocations, isLoading } = useAllocations(tab === 'all' ? {} : { status: tab })

  const filtered = useMemo(() => {
    if (!allocations) return []
    const q = search.trim().toLowerCase()
    if (!q) return allocations
    return allocations.filter((a) =>
      [a.title, a.allocation_number, a.site_name, a.contractor?.company_name].filter(Boolean).some((v) =>
        v.toLowerCase().includes(q)
      )
    )
  }, [allocations, search])

  return (
    <div>
      <PageHeader
        title="Allocation register"
        description="Work allocated out to contractors, tracked end to end."
        actions={
          <Button asChild>
            <Link to="/allocations/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New allocation
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t === 'all' ? 'All' : titleCase(t)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <SearchInput value={search} onChange={setSearch} placeholder="Search allocations…" className="sm:w-72" />
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={ClipboardList}
              title="No allocations found"
              description="Try adjusting your filters, or create the first allocation."
              action={
                <Button asChild size="sm">
                  <Link to="/allocations/new">
                    <Plus className="mr-1.5 h-4 w-4" />
                    New allocation
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Allocation</TableHead>
                <TableHead className="hidden md:table-cell">Site</TableHead>
                <TableHead className="hidden md:table-cell">Contractor</TableHead>
                <TableHead className="hidden sm:table-cell">Dates</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((allocation) => (
                <TableRow
                  key={allocation.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/allocations/${allocation.id}`)}
                >
                  <TableCell>
                    <p className="font-medium text-foreground">{allocation.title}</p>
                    <p className="text-xs text-muted-foreground">{allocation.allocation_number}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {allocation.site_name ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {allocation.site_name}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {allocation.contractor?.company_name || '—'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground whitespace-nowrap">
                    {formatDate(allocation.start_date)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={allocation.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
