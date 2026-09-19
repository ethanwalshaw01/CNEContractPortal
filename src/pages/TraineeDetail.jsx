import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Trash2, Plus, FileCheck2, AlertTriangle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { PageSpinner } from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { trainees, trainingCerts } from '@/hooks/useEntities'
import { formatDate } from '@/lib/utils'

const EMPTY_FORM = { title: '', expiry_date: '', file_url: '' }

export default function TraineeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: trainee, isLoading } = trainees.useOne(id)
  const { data: certs, isLoading: certsLoading } = trainingCerts.useList({ trainee_id: id })
  const createCert = trainingCerts.useCreate()
  const removeCert = trainingCerts.useRemove()
  const removeTrainee = trainees.useRemove({ onSuccess: () => navigate('/trainees') })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDeleteCertId, setConfirmDeleteCertId] = useState(null)
  const [confirmDeleteTrainee, setConfirmDeleteTrainee] = useState(false)

  if (isLoading) return <PageSpinner />
  if (!trainee) return null

  const handleAddCert = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    createCert.mutate(
      { ...form, trainee_id: id, person_name: trainee.name, expiry_date: form.expiry_date || null },
      {
        onSuccess: () => {
          toast.success('Certificate added')
          setDialogOpen(false)
          setForm(EMPTY_FORM)
        },
      }
    )
  }

  const isExpired = (cert) => cert.expiry_date && new Date(cert.expiry_date) < new Date()

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/trainees')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trainees
      </button>

      <PageHeader
        title={trainee.name}
        description={trainee.card_provider ? `${trainee.card_provider.toUpperCase()} ${trainee.card_number || ''}` : 'Trainee'}
        actions={
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirmDeleteTrainee(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete
          </Button>
        }
      />

      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <p className="text-sm font-medium">Training certificates</p>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add certificate
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-0">
          {certsLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          ) : !certs?.length ? (
            <div className="p-6">
              <EmptyState icon={FileCheck2} title="No certificates yet" description="Add this trainee's certificates and cards." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {certs.map((cert) => (
                <li key={cert.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">Expires {formatDate(cert.expiry_date)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {isExpired(cert) && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Expired
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setConfirmDeleteCertId(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add certificate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCert} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Certificate title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expiry_date">Expiry date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="file_url">File URL</Label>
              <Input id="file_url" value={form.file_url} onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCert.isPending}>
                {createCert.isPending ? 'Saving…' : 'Add certificate'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDeleteCertId)}
        onOpenChange={(open) => !open && setConfirmDeleteCertId(null)}
        title="Delete this certificate?"
        confirmLabel="Delete"
        loading={removeCert.isPending}
        onConfirm={() =>
          removeCert.mutate(confirmDeleteCertId, {
            onSuccess: () => {
              toast.success('Certificate deleted')
              setConfirmDeleteCertId(null)
            },
          })
        }
      />

      <ConfirmDialog
        open={confirmDeleteTrainee}
        onOpenChange={setConfirmDeleteTrainee}
        title="Delete this trainee?"
        description="Their certificates will be deleted too."
        confirmLabel="Delete trainee"
        loading={removeTrainee.isPending}
        onConfirm={() => removeTrainee.mutate(id)}
      />
    </div>
  )
}
