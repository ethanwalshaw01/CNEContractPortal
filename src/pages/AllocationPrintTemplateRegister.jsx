import { Printer } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { allocationPrintTemplates } from '@/hooks/useEntities'
import { titleCase } from '@/lib/utils'

const ALLOCATION_TYPES = ['trakway', 'standard', 'access_veg', 'scaffold', 'site_fitter', 'security', 'custom'].map((v) => ({
  value: v,
  label: titleCase(v),
}))

const MODES = [
  { value: 'blank', label: 'Blank layout' },
  { value: 'pdf', label: 'PDF background' },
]

const FIELDS = [
  { name: 'name', label: 'Template name', required: true },
  { name: 'allocation_type', label: 'Allocation type', type: 'select', options: ALLOCATION_TYPES },
  { name: 'mode', label: 'Mode', type: 'select', options: MODES },
  { name: 'pdf_url', label: 'PDF URL' },
  { name: 'num_pages', label: 'Number of pages', type: 'number' },
]

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'allocation_type', label: 'Type', render: (r) => titleCase(r.allocation_type) },
  { key: 'mode', label: 'Mode', hideOnMobile: true },
]

export default function AllocationPrintTemplateRegister() {
  return (
    <SimpleRegister
      title="Allocation print templates"
      description="Print and PDF layout templates for allocations."
      icon={Printer}
      entityLabel="template"
      addLabel="Add template"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name']}
      useList={allocationPrintTemplates.useList}
      useCreate={allocationPrintTemplates.useCreate}
      useUpdate={allocationPrintTemplates.useUpdate}
      useRemove={allocationPrintTemplates.useRemove}
    />
  )
}
