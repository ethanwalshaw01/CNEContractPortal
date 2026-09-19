import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ClipboardList } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { PageSpinner } from '@/components/common/Spinner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useContractors } from '@/hooks/useContractors'
import { usePermits } from '@/hooks/usePermits'
import { useAllocation, useCreateAllocation, useUpdateAllocation } from '@/hooks/useAllocations'
import { useAuth } from '@/context/AuthContext'

const STEPS = ['Details', 'Assign', 'Review']

const EMPTY_FORM = {
  title: '',
  site_name: '',
  scope_of_work: '',
  start_date: '',
  end_date: '',
  contractor_id: '',
  permit_id: '',
}

export default function AllocationBuilder() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: existing, isLoading } = useAllocation(id)
  const { data: contractors } = useContractors({ status: 'active' })
  const { data: permits } = usePermits()

  const createAllocation = useCreateAllocation({ onSuccess: (a) => navigate(`/allocations/${a.id}`) })
  const updateAllocation = useUpdateAllocation({ onSuccess: (a) => navigate(`/allocations/${a.id}`) })

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        site_name: existing.site_name || '',
        scope_of_work: existing.scope_of_work || '',
        start_date: existing.start_date?.slice(0, 10) || '',
        end_date: existing.end_date?.slice(0, 10) || '',
        contractor_id: existing.contractor_id || '',
        permit_id: existing.permit_id || '',
      })
    }
  }, [existing])

  if (isEdit && isLoading) return <PageSpinner />

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const canContinue = step === 0 ? form.title.trim().length > 0 : true

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const submit = () => {
    const payload = {
      ...form,
      contractor_id: form.contractor_id || null,
      permit_id: form.permit_id || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    }
    if (isEdit) {
      updateAllocation.mutate({ id, ...payload })
    } else {
      createAllocation.mutate({ ...payload, created_by: user.id, status: 'draft' })
    }
  }

  const saving = createAllocation.isPending || updateAllocation.isPending
  const selectedContractor = contractors?.find((c) => c.id === form.contractor_id)
  const selectedPermit = permits?.find((p) => p.id === form.permit_id)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={isEdit ? 'Edit allocation' : 'New allocation'}
        description="Allocate work to a contractor in a few quick steps."
      />

      <div className="mb-6 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                i < step
                  ? 'bg-success text-success-foreground'
                  : i === step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('hidden text-sm font-medium sm:inline', i === step ? 'text-foreground' : 'text-muted-foreground')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-border sm:w-12" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="min-h-[320px] p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      autoFocus
                      value={form.title}
                      onChange={(e) => update('title')(e.target.value)}
                      placeholder="e.g. Vegetation clearance — Route 14"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="site_name">Site name</Label>
                    <Input id="site_name" value={form.site_name} onChange={(e) => update('site_name')(e.target.value)} />
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
                    <Label htmlFor="scope">Scope of work</Label>
                    <Textarea
                      id="scope"
                      rows={4}
                      value={form.scope_of_work}
                      onChange={(e) => update('scope_of_work')(e.target.value)}
                      placeholder="Describe the work being allocated…"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label>Contractor</Label>
                    <Select value={form.contractor_id} onValueChange={update('contractor_id')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contractor" />
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
                  <div className="space-y-1.5">
                    <Label>Linked permit (optional)</Label>
                    <Select value={form.permit_id} onValueChange={update('permit_id')}>
                      <SelectTrigger>
                        <SelectValue placeholder="No linked permit" />
                      </SelectTrigger>
                      <SelectContent>
                        {permits?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.permit_number} — {p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Linking a permit lets the contractor see permit conditions when they accept.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-accent p-4 text-accent-foreground">
                    <ClipboardList className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">Review the allocation before {isEdit ? 'saving' : 'creating'} it.</p>
                  </div>
                  <ReviewRow label="Title" value={form.title} />
                  <ReviewRow label="Site" value={form.site_name || '—'} />
                  <ReviewRow label="Dates" value={`${form.start_date || '—'} to ${form.end_date || '—'}`} />
                  <ReviewRow label="Contractor" value={selectedContractor?.company_name || 'Unassigned'} />
                  <ReviewRow label="Linked permit" value={selectedPermit ? `${selectedPermit.permit_number} — ${selectedPermit.title}` : 'None'} />
                  {form.scope_of_work && <ReviewRow label="Scope of work" value={form.scope_of_work} multiline />}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={step === 0 ? () => navigate(-1) : handleBack}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} disabled={!canContinue}>
            Next
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create allocation'}
          </Button>
        )}
      </div>
    </div>
  )
}

function ReviewRow({ label, value, multiline }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn('col-span-2 text-sm font-medium text-foreground', multiline && 'whitespace-pre-line')}>{value}</dd>
    </div>
  )
}
