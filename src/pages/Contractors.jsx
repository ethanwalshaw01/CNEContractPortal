import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Building2, Mail, Phone, Pencil, Trash2, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { useContractors, useCreateContractor, useUpdateContractor, useDeleteContractor } from '@/hooks/useContractors'

const EMPTY_FORM = { company_name: '', contact_name: '', email: '', phone: '', trade: '', status: 'active', notes: '' }

export default function Contractors() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const { data: contractors, isLoading } = useContractors()
  const createContractor = useCreateContractor()
  const updateContractor = useUpdateContractor()
  const deleteContractor = useDeleteContractor()

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    if (params.get('new') === '1') {
      openCreate()
      params.delete('new')
      setParams(params, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!contractors) return []
    const q = search.trim().toLowerCase()
    if (!q) return contractors
    return contractors.filter((c) => [c.company_name, c.contact_name, c.trade].filter(Boolean).some((v) => v.toLowerCase().includes(q)))
  }, [contractors, search])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (contractor) => {
    setEditing(contractor)
    setForm({
      company_name: contractor.company_name || '',
      contact_name: contractor.contact_name || '',
      email: contractor.email || '',
      phone: contractor.phone || '',
      trade: contractor.trade || '',
      status: contractor.status || 'active',
      notes: contractor.notes || '',
    })
    setDialogOpen(true)
  }

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company_name.trim()) {
      toast.error('Company name is required')
      return
    }
    const onSuccess = () => {
      toast.success(editing ? 'Contractor updated' : 'Contractor added')
      setDialogOpen(false)
    }
    if (editing) {
      updateContractor.mutate({ id: editing.id, ...form }, { onSuccess })
    } else {
      createContractor.mutate({ ...form, created_by: user.id }, { onSuccess })
    }
  }

  const saving = createContractor.isPending || updateContractor.isPending

  return (
    <div>
      <PageHeader
        title="Contractors"
        description="Companies you allocate work to."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add contractor
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search contractors…" className="mb-4 sm:w-72" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No contractors yet"
          description="Add the companies you allocate work to."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add contractor
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((contractor) => (
            <Card key={contractor.id} className="group relative shadow-soft transition-shadow hover:shadow-panel">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold leading-tight text-foreground">{contractor.company_name}</p>
                      {contractor.trade && <p className="text-xs text-muted-foreground">{contractor.trade}</p>}
                    </div>
                  </div>
                  <Badge variant={contractor.status === 'active' ? 'success' : 'outline'}>{contractor.status}</Badge>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {contractor.contact_name && <p>{contractor.contact_name}</p>}
                  {contractor.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {contractor.email}
                    </p>
                  )}
                  {contractor.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {contractor.phone}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(contractor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmDeleteId(contractor.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit contractor' : 'Add contractor'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="company_name">Company name</Label>
              <Input id="company_name" value={form.company_name} onChange={(e) => update('company_name')(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact_name">Contact name</Label>
                <Input id="contact_name" value={form.contact_name} onChange={(e) => update('contact_name')(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="trade">Trade</Label>
                <Input id="trade" value={form.trade} onChange={(e) => update('trade')(e.target.value)} placeholder="e.g. Scaffolding" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update('email')(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update('phone')(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={update('status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => update('notes')(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add contractor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title="Delete this contractor?"
        description="This action can't be undone."
        confirmLabel="Delete"
        loading={deleteContractor.isPending}
        onConfirm={() =>
          deleteContractor.mutate(confirmDeleteId, {
            onSuccess: () => {
              toast.success('Contractor deleted')
              setConfirmDeleteId(null)
            },
          })
        }
      />
    </div>
  )
}
