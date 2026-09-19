import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Save, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { PageSpinner } from '@/components/common/Spinner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContractors } from '@/hooks/useContractors'
import { usePermit, useCreatePermit, useUpdatePermit } from '@/hooks/usePermits'
import { useAuth } from '@/context/AuthContext'
import { PERMIT_TYPES, RISK_LEVELS } from '@/lib/constants'

const EMPTY_FORM = {
  title: '',
  permit_type: 'general',
  site_name: '',
  location: '',
  description: '',
  risk_level: 'medium',
  contractor_id: '',
  start_date: '',
  end_date: '',
}

export default function PermitForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: existing, isLoading } = usePermit(id)
  const { data: contractors } = useContractors({ status: 'active' })
  const createPermit = useCreatePermit({ onSuccess: (p) => navigate(`/permits/${p.id}`) })
  const updatePermit = useUpdatePermit({ onSuccess: (p) => navigate(`/permits/${p.id}`) })

  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        permit_type: existing.permit_type || 'general',
        site_name: existing.site_name || '',
        location: existing.location || '',
        description: existing.description || '',
        risk_level: existing.risk_level || 'medium',
        contractor_id: existing.contractor_id || '',
        start_date: existing.start_date?.slice(0, 10) || '',
        end_date: existing.end_date?.slice(0, 10) || '',
      })
    }
  }, [existing])

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    const payload = {
      ...form,
      contractor_id: form.contractor_id || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    }
    if (isEdit) {
      updatePermit.mutate({ id, ...payload })
    } else {
      createPermit.mutate({ ...payload, created_by: user.id })
    }
  }

  if (isEdit && isLoading) return <PageSpinner />

  const saving = createPermit.isPending || updatePermit.isPending

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={isEdit ? 'Edit permit' : 'New permit'} description="Fill in the details for this permit to work." />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => update('title')(e.target.value)}
                placeholder="e.g. Replace pole P114 conductor"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Permit type</Label>
                <Select value={form.permit_type} onValueChange={update('permit_type')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PERMIT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Risk level</Label>
                <Select value={form.risk_level} onValueChange={update('risk_level')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_LEVELS.map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="site_name">Site name</Label>
                <Input id="site_name" value={form.site_name} onChange={(e) => update('site_name')(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => update('location')(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Contractor</Label>
              <Select value={form.contractor_id} onValueChange={update('contractor_id')}>
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {contractors?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="start_date">Start date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => update('start_date')(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end_date">End date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => update('end_date')(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => update('description')(e.target.value)}
                placeholder="Scope of work, precautions, isolation details…"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <X className="mr-1.5 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create permit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
