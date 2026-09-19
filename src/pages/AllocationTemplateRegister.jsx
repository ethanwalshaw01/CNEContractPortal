import { LayoutTemplate } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { allocationTemplates } from '@/hooks/useEntities'
import { titleCase } from '@/lib/utils'

const ALLOCATION_TYPES = ['trakway', 'standard', 'access_veg', 'scaffold', 'site_fitter', 'security', 'custom'].map((v) => ({
  value: v,
  label: titleCase(v),
}))

const FIELDS = [
  { name: 'name', label: 'Template name', required: true },
  { name: 'allocation_type', label: 'Allocation type', type: 'select', options: ALLOCATION_TYPES },
  { name: 'description', label: 'Description', type: 'textarea' },
]

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'allocation_type', label: 'Type', render: (r) => titleCase(r.allocation_type) },
  { key: 'description', label: 'Description', hideOnMobile: true },
]

export default function AllocationTemplateRegister() {
  return (
    <SimpleRegister
      title="Allocation templates"
      description="Reusable structures and autofill rules for creating new allocations."
      icon={LayoutTemplate}
      entityLabel="template"
      addLabel="Add template"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name']}
      useList={allocationTemplates.useList}
      useCreate={allocationTemplates.useCreate}
      useUpdate={allocationTemplates.useUpdate}
      useRemove={allocationTemplates.useRemove}
    />
  )
}
