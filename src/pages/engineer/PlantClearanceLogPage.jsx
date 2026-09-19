import { useState } from 'react'
import { toast } from 'sonner'
import { Zap, Plus, Pencil, Trash2, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { plantClearanceLogs } from '@/hooks/useEntities'

const EMPTY_ENTRY = { line_voltage: '', obstacle: '', height_distance_a: '' }
const EMPTY_FORM = { location: '', item_number: '', entries: [{ ...EMPTY_ENTRY }] }

export default function PlantClearanceLogPage() {
  const { user } = useAuth()
  const { data: rows, isLoading } = plantClearanceLogs.useList()
  const createRow = plantClearanceLogs.useCreate()
  const updateRow = plantClearanceLogs.useUpdate()
  const removeRow = plantClearanceLogs.useRemove()

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
      location: row.location || '',
      item_number: row.item_number || '',
      entries: row.entries?.length ? row.entries : [{ ...EMPTY_ENTRY }],
    })
    setDialogOpen(true)
  }

  const updateEntry = (index, patch) =>
    setForm((f) => ({ ...f, entries: f.entries.map((e, i) => (i === index ? { ...e, ...patch } : e)) }))

  const addEntry = () => setForm((f) => ({ ...f, entries: [...f.entries, { ...EMPTY_ENTRY }] }))
  const removeEntry = (index) => setForm((f) => ({ ...f, entries: f.entries.filter((_, i) => i !== index) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.location.trim()) {
      toast.error('Location is required')
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
        title="Plant clearance log"
        description="Clearance distances between plant and live overhead-line voltages."
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
          icon={Zap}
          title="No logs yet"
          description="Record plant clearance checks against live voltages."
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
                  <p className="font-medium">{row.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {row.item_number ? `Item ${row.item_number} · ` : ''}
                    {row.entries?.length || 0} entr{row.entries?.length === 1 ? 'y' : 'ies'}
                  </p>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="item_number">Item number</Label>
                <Input
                  id="item_number"
                  value={form.item_number}
                  onChange={(e) => setForm((f) => ({ ...f, item_number: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Clearance entries</Label>
              {form.entries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Line voltage"
                    value={entry.line_voltage}
                    onChange={(e) => updateEntry(i, { line_voltage: e.target.value })}
                  />
                  <Input placeholder="Obstacle" value={entry.obstacle} onChange={(e) => updateEntry(i, { obstacle: e.target.value })} />
                  <Input
                    placeholder="Height/distance"
                    value={entry.height_distance_a}
                    onChange={(e) => updateEntry(i, { height_distance_a: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removeEntry(i)}
                    disabled={form.entries.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addEntry}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add entry
              </Button>
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
