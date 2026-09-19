import { FileStack } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { permitTemplates } from '@/hooks/useEntities'

const PERMIT_TYPES = [
  { value: 'GD', label: 'Ground Disturbance' },
  { value: 'HW', label: 'Hot Work' },
  { value: 'PILE', label: 'Piling' },
  { value: 'Pump', label: 'Pump' },
  { value: 'PTW', label: 'Scaffold Permit to Work' },
]

const FIELDS = [
  { name: 'name', label: 'Template name', required: true },
  { name: 'permit_type', label: 'Permit type', type: 'select', options: PERMIT_TYPES },
  { name: 'pdf_url', label: 'Background PDF URL', required: true },
]

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'permit_type', label: 'Permit type' },
]

export default function PermitTemplateRegister() {
  return (
    <SimpleRegister
      title="Permit templates"
      description="Printable layout templates used to render each permit type."
      icon={FileStack}
      entityLabel="template"
      addLabel="Add template"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name']}
      useList={permitTemplates.useList}
      useCreate={permitTemplates.useCreate}
      useUpdate={permitTemplates.useUpdate}
      useRemove={permitTemplates.useRemove}
    />
  )
}
