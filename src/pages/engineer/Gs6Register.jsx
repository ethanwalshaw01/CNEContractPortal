import { Radio } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { gs6Entries } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'tower_number', label: 'Tower number', required: true },
  { name: 'route', label: 'Route' },
  { name: 'location', label: 'Location' },
  { name: 'qty_installed', label: 'Quantity installed', type: 'number' },
  { name: 'installed_by', label: 'Installed by' },
  { name: 'installed_date', label: 'Installed date' },
  { name: 'height_set_at', label: 'Height set at' },
  { name: 'date_removed', label: 'Date removed' },
  { name: 'removed_by', label: 'Removed by' },
  { name: 'last_inspection_date', label: 'Last inspection date' },
  { name: 'inspection_by', label: 'Inspection by' },
  { name: 'comments', label: 'Comments', type: 'textarea' },
]

const COLUMNS = [
  { key: 'tower_number', label: 'Tower' },
  { key: 'route', label: 'Route', hideOnMobile: true },
  { key: 'location', label: 'Location', hideOnMobile: true },
  { key: 'qty_installed', label: 'Qty' },
  { key: 'last_inspection_date', label: 'Last inspection', hideOnMobile: true },
]

export default function Gs6Register() {
  return (
    <SimpleRegister
      title="GS6 register"
      description="Install, removal and inspection log for GS6 markers and spacers."
      icon={Radio}
      entityLabel="GS6 entry"
      addLabel="Add entry"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['tower_number', 'route', 'location']}
      useList={gs6Entries.useList}
      useCreate={gs6Entries.useCreate}
      useUpdate={gs6Entries.useUpdate}
      useRemove={gs6Entries.useRemove}
    />
  )
}
