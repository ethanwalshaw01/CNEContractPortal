import { Activity } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { havsLogEntries } from '@/hooks/useEntities'
import { formatDate } from '@/lib/utils'

const FIELDS = [
  { name: 'person_name', label: 'Person', required: true },
  { name: 'equipment_name', label: 'Equipment', required: true },
  { name: 'entry_date', label: 'Date', type: 'date', required: true },
  { name: 'minutes_used', label: 'Minutes used', type: 'number' },
  { name: 'break_minutes', label: 'Break minutes', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

const COLUMNS = [
  { key: 'person_name', label: 'Person' },
  { key: 'equipment_name', label: 'Equipment' },
  { key: 'minutes_used', label: 'Minutes', hideOnMobile: true },
  { key: 'entry_date', label: 'Date', render: (r) => formatDate(r.entry_date) },
]

export default function HavsRegister() {
  return (
    <SimpleRegister
      title="HAVS register"
      description="Hand-arm vibration exposure log by person and equipment."
      icon={Activity}
      entityLabel="HAVS entry"
      addLabel="Add entry"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['person_name', 'equipment_name']}
      useList={havsLogEntries.useList}
      useCreate={havsLogEntries.useCreate}
      useUpdate={havsLogEntries.useUpdate}
      useRemove={havsLogEntries.useRemove}
    />
  )
}
