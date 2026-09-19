import { FileSignature } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { passFormTemplates } from '@/hooks/useEntities'

const FIELDS = [{ name: 'name', label: 'Template name', required: true }]
const COLUMNS = [{ key: 'name', label: 'Name' }]

export default function PassFormTemplateRegister() {
  return (
    <SimpleRegister
      title="PASS form templates"
      description="Saved prefill templates for PASS site safety assessments."
      icon={FileSignature}
      entityLabel="template"
      addLabel="Add template"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name']}
      useList={passFormTemplates.useList}
      useCreate={passFormTemplates.useCreate}
      useUpdate={passFormTemplates.useUpdate}
      useRemove={passFormTemplates.useRemove}
    />
  )
}
