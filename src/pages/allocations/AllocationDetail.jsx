import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  CalendarRange,
  FileText,
  Send,
  PlayCircle,
  CheckCircle2,
  Archive,
  Link2,
  Copy,
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { PageSpinner } from '@/components/common/Spinner'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAllocation, useUpdateAllocation, useDeleteAllocation } from '@/hooks/useAllocations'
import { formatDate, formatDateTime } from '@/lib/utils'

const NEXT_STATUS = {
  draft: { value: 'pending_acceptance', label: 'Send for acceptance', icon: Send },
  accepted: { value: 'live', label: 'Start work', icon: PlayCircle },
  live: { value: 'completed', label: 'Mark completed', icon: CheckCircle2 },
  completed: { value: 'archived', label: 'Archive', icon: Archive },
}

export default function AllocationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: allocation, isLoading } = useAllocation(id)
  const updateAllocation = useUpdateAllocation()
  const deleteAllocation = useDeleteAllocation({ onSuccess: () => navigate('/allocations') })

  if (isLoading) return <PageSpinner />
  if (!allocation) return null

  const next = NEXT_STATUS[allocation.status]

  const advance = () => {
    updateAllocation.mutate(
      { id: allocation.id, status: next.value },
      { onSuccess: () => toast.success('Allocation updated') }
    )
  }

  const acceptLink = `${window.location.origin}/allocations/${allocation.id}/accept`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(acceptLink)
      toast.success('Acceptance link copied')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/allocations')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to allocation register
      </button>

      <PageHeader
        title={allocation.title}
        description={allocation.allocation_number}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/allocations/${id}/edit`}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </Link>
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

      <div className="mb-4">
        <StatusBadge status={allocation.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allocation.scope_of_work && (
            <p className="text-sm text-foreground/90 whitespace-pre-line">{allocation.scope_of_work}</p>
          )}
          <Separator />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Site" value={allocation.site_name || '—'} />
            <InfoRow icon={Building2} label="Contractor" value={allocation.contractor?.company_name || 'Unassigned'} />
            <InfoRow
              icon={CalendarRange}
              label="Dates"
              value={`${formatDate(allocation.start_date)} — ${formatDate(allocation.end_date)}`}
            />
            {allocation.permit && (
              <InfoRow
                icon={FileText}
                label="Linked permit"
                value={
                  <Link to={`/permits/${allocation.permit.id}`} className="text-primary hover:underline">
                    {allocation.permit.permit_number} — {allocation.permit.title}
                  </Link>
                }
              />
            )}
          </div>
          {allocation.accepted_by_name && (
            <>
              <Separator />
              <InfoRow
                icon={CheckCircle2}
                label="Accepted by"
                value={`${allocation.accepted_by_name} · ${formatDateTime(allocation.accepted_at)}`}
              />
            </>
          )}
        </CardContent>
      </Card>

      {allocation.status === 'pending_acceptance' && (
        <Card className="mt-4 border-warning/30 bg-warning/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-medium">Waiting on contractor acceptance</p>
                <p className="text-xs text-muted-foreground">Share this link — no account needed to accept.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy link
            </Button>
          </CardContent>
        </Card>
      )}

      {next && (
        <div className="mt-4 flex justify-end">
          <Button onClick={advance} disabled={updateAllocation.isPending}>
            <next.icon className="mr-1.5 h-4 w-4" />
            {next.label}
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this allocation?"
        description="This action can't be undone."
        confirmLabel="Delete allocation"
        loading={deleteAllocation.isPending}
        onConfirm={() => deleteAllocation.mutate(id)}
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
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
