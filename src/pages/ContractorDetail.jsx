import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  FileText,
  ClipboardList,
  MapPin,
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { PageSpinner } from '@/components/common/Spinner'
import StatusBadge from '@/components/common/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContractor, useDeleteContractor } from '@/hooks/useContractors'
import { usePermits } from '@/hooks/usePermits'
import { useAllocations } from '@/hooks/useAllocations'
import { formatDate } from '@/lib/utils'

export default function ContractorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: contractor, isLoading } = useContractor(id)
  const { data: permits, isLoading: permitsLoading } = usePermits({ contractor_id: id })
  const { data: allocations, isLoading: allocationsLoading } = useAllocations({ contractor_id: id })
  const deleteContractor = useDeleteContractor({ onSuccess: () => navigate('/contractors') })

  if (isLoading) return <PageSpinner />
  if (!contractor) return null

  const activeAllocations = allocations?.filter((a) => ['live', 'accepted', 'pending_acceptance'].includes(a.status)).length ?? 0
  const openPermits = permits?.filter((p) => ['issued', 'live'].includes(p.status)).length ?? 0

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => navigate('/contractors')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to contractors
      </button>

      <PageHeader
        title={contractor.company_name}
        description={contractor.trade || 'Contractor'}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate(`/contractors?edit=${id}`)}>
              <Pencil className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
            <div className="mt-2.5">
              <StatusBadge status={contractor.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Open permits</p>
            <p className="mt-2 font-heading text-3xl font-bold leading-none tabular-nums">{openPermits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active allocations</p>
            <p className="mt-2 font-heading text-3xl font-bold leading-none tabular-nums">{activeAllocations}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow icon={Building2} label="Contact name" value={contractor.contact_name || '—'} />
          <InfoRow icon={Mail} label="Email" value={contractor.email || '—'} />
          <InfoRow icon={Phone} label="Phone" value={contractor.phone || '—'} />
          {contractor.notes && <InfoRow icon={FileText} label="Notes" value={contractor.notes} />}
        </CardContent>
      </Card>

      <Tabs defaultValue="permits" className="mt-6">
        <TabsList>
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="permits">
          <Card>
            <CardContent className="p-0">
              {permitsLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading…</div>
              ) : !permits?.length ? (
                <div className="p-6">
                  <EmptyState icon={FileText} title="No permits yet" description="Permits issued to this contractor will appear here." />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {permits.map((permit) => (
                    <li key={permit.id}>
                      <Link
                        to={`/permits/${permit.id}`}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{permit.title}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            {permit.permit_number}
                            {permit.site_name && (
                              <>
                                <span>·</span>
                                <MapPin className="h-3 w-3" /> {permit.site_name}
                              </>
                            )}
                          </p>
                        </div>
                        <StatusBadge status={permit.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations">
          <Card>
            <CardContent className="p-0">
              {allocationsLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading…</div>
              ) : !allocations?.length ? (
                <div className="p-6">
                  <EmptyState
                    icon={ClipboardList}
                    title="No allocations yet"
                    description="Work allocated to this contractor will appear here."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {allocations.map((allocation) => (
                    <li key={allocation.id}>
                      <Link
                        to={`/allocations/${allocation.id}`}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{allocation.title}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            {allocation.allocation_number}
                            {allocation.start_date && (
                              <>
                                <span>·</span> {formatDate(allocation.start_date)}
                              </>
                            )}
                          </p>
                        </div>
                        <StatusBadge status={allocation.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this contractor?"
        description="Their permits and allocations will stay on record but no longer be linked to a contractor."
        confirmLabel="Delete contractor"
        loading={deleteContractor.isPending}
        onConfirm={() =>
          deleteContractor.mutate(id, { onSuccess: () => toast.success('Contractor deleted') })
        }
      />
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground whitespace-pre-line">{value}</p>
      </div>
    </div>
  )
}
