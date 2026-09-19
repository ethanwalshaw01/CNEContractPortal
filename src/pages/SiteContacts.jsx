import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Users, Mail, Phone, MapPin, Pencil, Trash2, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
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
import { useSiteContacts, useCreateSiteContact, useUpdateSiteContact, useDeleteSiteContact } from '@/hooks/useSiteContacts'

const EMPTY_FORM = { name: '', role_title: '', site_name: '', phone: '', email: '', notes: '' }

export default function SiteContacts() {
  const { user } = useAuth()
  const { data: contacts, isLoading } = useSiteContacts()
  const createContact = useCreateSiteContact()
  const updateContact = useUpdateSiteContact()
  const deleteContact = useDeleteSiteContact()

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const filtered = useMemo(() => {
    if (!contacts) return []
    const q = search.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter((c) => [c.name, c.site_name, c.role_title].filter(Boolean).some((v) => v.toLowerCase().includes(q)))
  }, [contacts, search])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (contact) => {
    setEditing(contact)
    setForm({
      name: contact.name || '',
      role_title: contact.role_title || '',
      site_name: contact.site_name || '',
      phone: contact.phone || '',
      email: contact.email || '',
      notes: contact.notes || '',
    })
    setDialogOpen(true)
  }

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    const onSuccess = () => {
      toast.success(editing ? 'Contact updated' : 'Contact added')
      setDialogOpen(false)
    }
    if (editing) {
      updateContact.mutate({ id: editing.id, ...form }, { onSuccess })
    } else {
      createContact.mutate({ ...form, created_by: user.id }, { onSuccess })
    }
  }

  const saving = createContact.isPending || updateContact.isPending

  return (
    <div>
      <PageHeader
        title="Site contacts"
        description="Key contacts for the sites you work on."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add contact
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search contacts…" className="mb-4 sm:w-72" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No site contacts yet"
          description="Add key contacts for your sites."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add contact
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((contact) => (
            <Card key={contact.id} className="group transition-colors hover:border-foreground/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight text-foreground">{contact.name}</p>
                    {contact.role_title && <p className="text-xs text-muted-foreground">{contact.role_title}</p>}
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {contact.site_name && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {contact.site_name}
                    </p>
                  )}
                  {contact.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {contact.email}
                    </p>
                  )}
                  {contact.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {contact.phone}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(contact)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmDeleteId(contact.id)}
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
            <DialogTitle>{editing ? 'Edit contact' : 'Add contact'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => update('name')(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role_title">Role</Label>
                <Input id="role_title" value={form.role_title} onChange={(e) => update('role_title')(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site_name">Site name</Label>
              <Input id="site_name" value={form.site_name} onChange={(e) => update('site_name')(e.target.value)} />
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => update('notes')(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add contact'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title="Delete this contact?"
        description="This action can't be undone."
        confirmLabel="Delete"
        loading={deleteContact.isPending}
        onConfirm={() =>
          deleteContact.mutate(confirmDeleteId, {
            onSuccess: () => {
              toast.success('Contact deleted')
              setConfirmDeleteId(null)
            },
          })
        }
      />
    </div>
  )
}
