import { ClipboardList } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { passFormLogs } from '@/hooks/useEntities'
import { formatDate } from '@/lib/utils'

const FIELDS = [
  { name: 'project_name', label: 'Project name', required: true },
  { name: 'site_location', label: 'Site location', required: true },
  { name: 'description_of_works', label: 'Description of works', type: 'textarea' },
  { name: 'person_in_charge', label: 'Person in charge' },
  { name: 'assessor_name', label: 'Assessor name' },
  { name: 'assessor_date', label: 'Assessment date', type: 'date' },
  { name: 'archived', label: 'Archived', type: 'checkbox' },
]

const COLUMNS = [
  { key: 'project_name', label: 'Project' },
  { key: 'site_location', label: 'Site', hideOnMobile: true },
  { key: 'assessor_name', label: 'Assessor', hideOnMobile: true },
  { key: 'assessor_date', label: 'Date', render: (r) => formatDate(r.assessor_date) },
]

export default function PassFormLogRegister() {
  return (
    <SimpleRegister
      title="PASS form log"
      description="Logged PASS site safety assessments."
      icon={ClipboardList}
      entityLabel="PASS form"
      addLabel="Add PASS form"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['project_name', 'site_location']}
      useList={passFormLogs.useList}
      useCreate={passFormLogs.useCreate}
      useUpdate={passFormLogs.useUpdate}
      useRemove={passFormLogs.useRemove}
    />
  )
}
