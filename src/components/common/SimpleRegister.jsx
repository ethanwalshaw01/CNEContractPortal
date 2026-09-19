import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/context/AuthContext'

function emptyFormFrom(fields) {
  const form = {}
  for (const f of fields) form[f.name] = f.type === 'checkbox' ? false : ''
  return form
}

function FormField({ field, value, onChange }) {
  const { name, label, type = 'text', options, placeholder, rows } = field
  if (type === 'textarea') {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>{label}</Label>
        <Textarea id={name} rows={rows || 3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }
  if (type === 'select') {
    return (
      <div className="space-y-1.5">
        <Label>{label}</Label>
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || 'Select…'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  if (type === 'checkbox') {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
        <Label htmlFor={name} className="cursor-pointer">
          {label}
        </Label>
        <Switch id={name} checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber || null : e.target.value)}
      />
    </div>
  )
}

/**
 * Generic register page: search + table + create/edit dialog + delete confirm,
 * for the many entities whose UI is otherwise identical flat-field CRUD.
 */
export default function SimpleRegister({
  title,
  description,
  icon: Icon,
  addLabel = 'Add',
  entityLabel = 'record',
  fields,
  columns,
  searchKeys = [],
  useList,
  useCreate,
  useUpdate,
  useRemove,
  withCreatedBy = true,
  extraDefaults = {},
}) {
  const { user } = useAuth()
  const { data: rows, isLoading } = useList()
  const createRow = useCreate()
  const updateRow = useUpdate()
  const removeRow = useRemove()

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(() => emptyFormFrom(fields))
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const filtered = useMemo(() => {
    if (!rows) return []
    const q = search.trim().toLowerCase()
    if (!q || searchKeys.length === 0) return rows
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)))
  }, [rows, search, searchKeys])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyFormFrom(fields))
    setDialogOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    const next = {}
    for (const f of fields) next[f.name] = row[f.name] ?? (f.type === 'checkbox' ? false : '')
    setForm(next)
    setDialogOpen(true)
  }

  const update = (name) => (value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const requiredMissing = fields.find((f) => f.required && !String(form[f.name] ?? '').trim())
    if (requiredMissing) {
      toast.error(`${requiredMissing.label} is required`)
      return
    }
    const payload = { ...form, ...extraDefaults }
    const onSuccess = () => {
      toast.success(editing ? `${entityLabel} updated` : `${entityLabel} added`)
      setDialogOpen(false)
    }
    if (editing) {
      updateRow.mutate({ id: editing.id, ...payload }, { onSuccess })
    } else {
      createRow.mutate(withCreatedBy ? { ...payload, created_by: user.id } : payload, { onSuccess })
    }
  }

  const saving = createRow.isPending || updateRow.isPending

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            {addLabel}
          </Button>
        }
      />

      {searchKeys.length > 0 && (
        <SearchInput value={search} onChange={setSearch} placeholder={`Search…`} className="mb-4 sm:w-72" />
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Icon}
              title={`No ${entityLabel.toLowerCase()}s yet`}
              description={`Add the first ${entityLabel.toLowerCase()} to get started.`}
              action={
                <Button size="sm" onClick={openCreate}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  {addLabel}
                </Button>
              }
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key} className={c.hideOnMobile ? 'hidden sm:table-cell' : undefined}>
                    {c.label}
                  </TableHead>
                ))}
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.hideOnMobile ? 'hidden sm:table-cell' : undefined}>
                      {c.render ? c.render(row) : row[c.key] ?? '—'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${entityLabel.toLowerCase()}` : `Add ${entityLabel.toLowerCase()}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <FormField key={f.name} field={f} value={form[f.name]} onChange={update(f.name)} />
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : addLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title={`Delete this ${entityLabel.toLowerCase()}?`}
        description="This action can't be undone."
        confirmLabel="Delete"
        loading={removeRow.isPending}
        onConfirm={() =>
          removeRow.mutate(confirmDeleteId, {
            onSuccess: () => {
              toast.success(`${entityLabel} deleted`)
              setConfirmDeleteId(null)
            },
          })
        }
      />
    </div>
  )
}
