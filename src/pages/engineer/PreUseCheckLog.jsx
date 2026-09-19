import { ClipboardCheck } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { preUseChecks } from '@/hooks/useEntities'
import { formatDate } from '@/lib/utils'

const FIELDS = [
  { name: 'person_name', label: 'Person', required: true },
  { name: 'equipment_name', label: 'Equipment name', required: true },
  { name: 'equipment_number', label: 'Equipment / asset number' },
  { name: 'check_date', label: 'Date', type: 'date', required: true },
  { name: 'all_passed', label: 'All checks passed', type: 'checkbox' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

const COLUMNS = [
  { key: 'person_name', label: 'Person' },
  { key: 'equipment_name', label: 'Equipment' },
  { key: 'equipment_number', label: 'Asset #', hideOnMobile: true },
  { key: 'check_date', label: 'Date', render: (r) => formatDate(r.check_date) },
  { key: 'all_passed', label: 'Passed', render: (r) => (r.all_passed ? 'Yes' : 'No') },
]

export default function PreUseCheckLog() {
  return (
    <SimpleRegister
      title="Pre-use checks"
      description="Pre-use inspection log for machines and equipment."
      icon={ClipboardCheck}
      entityLabel="check"
      addLabel="Add check"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['person_name', 'equipment_name', 'equipment_number']}
      useList={preUseChecks.useList}
      useCreate={preUseChecks.useCreate}
      useUpdate={preUseChecks.useUpdate}
      useRemove={preUseChecks.useRemove}
    />
  )
}
