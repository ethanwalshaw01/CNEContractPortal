import { useState } from 'react'
import { toast } from 'sonner'
import { Ruler, Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { conductorHeightLogs } from '@/hooks/useEntities'

const EMPTY_CCT = { old_conductor_low: '', old_conductor_high: '', obstacle_height: '', new_conductor_low: '', new_conductor_high: '' }
const EMPTY_FORM = { item_number: '', notes: '', cct_being_worked_on: { ...EMPTY_CCT }, adjacent_cct: { ...EMPTY_CCT } }

function CctFields({ label, value, onChange }) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <p className="text-sm font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(EMPTY_CCT).map((key) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs capitalize">{key.replace(/_/g, ' ')}</Label>
            <Input
              type="number"
              value={value[key] ?? ''}
              onChange={(e) => onChange({ ...value, [key]: e.target.valueAsNumber || '' })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ConductorHeightLog() {
  const { user } = useAuth()
  const { data: rows, isLoading } = conductorHeightLogs.useList()
  const createRow = conductorHeightLogs.useCreate()
  const updateRow = conductorHeightLogs.useUpdate()
  const removeRow = conductorHeightLogs.useRemove()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      item_number: row.item_number || '',
      notes: row.notes || '',
      cct_being_worked_on: { ...EMPTY_CCT, ...(row.cct_being_worked_on || {}) },
      adjacent_cct: { ...EMPTY_CCT, ...(row.adjacent_cct || {}) },
    })
    setDialogOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.item_number.trim()) {
      toast.error('Item number is required')
      return
    }
    const onSuccess = () => {
      toast.success(editing ? 'Log updated' : 'Log added')
      setDialogOpen(false)
    }
    if (editing) {
      updateRow.mutate({ id: editing.id, ...form }, { onSuccess })
    } else {
      createRow.mutate({ ...form, created_by: user.id }, { onSuccess })
    }
  }

  const saving = createRow.isPending || updateRow.isPending

  return (
    <div>
      <PageHeader
        title="Conductor height log"
        description="Before/after conductor height measurements for scaffold crossings."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add log
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : !rows?.length ? (
        <EmptyState
          icon={Ruler}
          title="No logs yet"
          description="Record conductor height checks for scaffold items."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add log
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-medium">Item {row.item_number}</p>
                  {row.notes && <p className="truncate text-sm text-muted-foreground">{row.notes}</p>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmDeleteId(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit log' : 'Add log'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="item_number">Item number</Label>
              <Input
                id="item_number"
                value={form.item_number}
                onChange={(e) => setForm((f) => ({ ...f, item_number: e.target.value }))}
              />
            </div>
            <CctFields
              label="Circuit being worked on"
              value={form.cct_being_worked_on}
              onChange={(v) => setForm((f) => ({ ...f, cct_being_worked_on: v }))}
            />
            <CctFields
              label="Adjacent circuit"
              value={form.adjacent_cct}
              onChange={(v) => setForm((f) => ({ ...f, adjacent_cct: v }))}
            />
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add log'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title="Delete this log?"
        description="This action can't be undone."
        confirmLabel="Delete"
        loading={removeRow.isPending}
        onConfirm={() =>
          removeRow.mutate(confirmDeleteId, {
            onSuccess: () => {
              toast.success('Log deleted')
              setConfirmDeleteId(null)
            },
          })
        }
      />
    </div>
  )
}
