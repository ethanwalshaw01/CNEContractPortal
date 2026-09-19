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
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  Send,
  XCircle,
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { PageSpinner } from '@/components/common/Spinner'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { usePermit, useUpdatePermit, useDeletePermit } from '@/hooks/usePermits'
import { formatDate, formatDateTime, titleCase } from '@/lib/utils'

const NEXT_STATUS = {
  draft: { value: 'issued', label: 'Issue permit', icon: Send },
  issued: { value: 'live', label: 'Start work', icon: PlayCircle },
  live: { value: 'completed', label: 'Mark completed', icon: CheckCircle2 },
}

export default function PermitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const { data: permit, isLoading } = usePermit(id)
  const updatePermit = useUpdatePermit()
  const deletePermit = useDeletePermit({ onSuccess: () => navigate('/permits') })

  if (isLoading) return <PageSpinner />
  if (!permit) return null

  const advance = () => {
    const next = NEXT_STATUS[permit.status]
    if (!next) return
    const patch = { id: permit.id, status: next.value }
    if (next.value === 'issued') patch.issued_at = new Date().toISOString()
    if (next.value === 'completed') patch.completed_at = new Date().toISOString()
    updatePermit.mutate(patch, {
      onSuccess: () => toast.success(`Permit ${titleCase(next.value)}`),
    })
  }

  const cancelPermit = () => {
    updatePermit.mutate(
      { id: permit.id, status: 'cancelled' },
      {
        onSuccess: () => {
          toast.success('Permit cancelled')
          setConfirmCancel(false)
        },
      }
    )
  }

  const next = NEXT_STATUS[permit.status]
  const canCancel = ['draft', 'issued', 'live'].includes(permit.status)

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/permits')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to permit register
      </button>

      <PageHeader
        title={permit.title}
        description={`${permit.permit_number} · ${titleCase(permit.permit_type)}`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/permits/${id}/edit`}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={permit.status} />
        {permit.risk_level && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
            <AlertTriangle className="h-3 w-3" />
            {permit.risk_level} risk
          </span>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {permit.description && <p className="text-sm text-foreground/90 whitespace-pre-line">{permit.description}</p>}

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Site" value={permit.site_name || permit.location || '—'} />
            <InfoRow icon={Building2} label="Contractor" value={permit.contractor?.company_name || 'Unassigned'} />
            <InfoRow
              icon={CalendarRange}
              label="Dates"
              value={`${formatDate(permit.start_date)} — ${formatDate(permit.end_date)}`}
            />
            <InfoRow icon={CalendarRange} label="Created" value={formatDateTime(permit.created_at)} />
          </div>
        </CardContent>
      </Card>

      {(next || canCancel) && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {canCancel && (
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmCancel(true)}>
              <XCircle className="mr-1.5 h-4 w-4" />
              Cancel permit
            </Button>
          )}
          {next && (
            <Button onClick={advance} disabled={updatePermit.isPending}>
              <next.icon className="mr-1.5 h-4 w-4" />
              {next.label}
            </Button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this permit?"
        description="This action can't be undone."
        confirmLabel="Delete permit"
        loading={deletePermit.isPending}
        onConfirm={() => deletePermit.mutate(id)}
      />

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel this permit?"
        description="The permit will be marked as cancelled and removed from active work."
        confirmLabel="Cancel permit"
        loading={updatePermit.isPending}
        onConfirm={cancelPermit}
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
