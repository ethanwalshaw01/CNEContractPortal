import { Footprints } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { lineWalks } from '@/hooks/useEntities'

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const FIELDS = [
  { name: 'line_name', label: 'Line name', required: true },
  { name: 'tower_number', label: 'Tower number', required: true },
  { name: 'access_works_description', label: 'Access works', type: 'textarea' },
  { name: 'vegetation_description', label: 'Vegetation', type: 'textarea' },
  { name: 'watercourses_nearby', label: 'Watercourses nearby', type: 'select', options: YES_NO },
  { name: 'watercourses_description', label: 'Watercourses detail', type: 'textarea' },
  { name: 'live_stock_in_field', label: 'Livestock in field', type: 'select', options: YES_NO },
  { name: 'live_stock_description', label: 'Livestock detail', type: 'textarea' },
]

const COLUMNS = [
  { key: 'line_name', label: 'Line' },
  { key: 'tower_number', label: 'Tower' },
  { key: 'watercourses_nearby', label: 'Watercourses', hideOnMobile: true },
  { key: 'live_stock_in_field', label: 'Livestock', hideOnMobile: true },
]

export default function LineWalkLog() {
  return (
    <SimpleRegister
      title="Line walk log"
      description="Access, vegetation and hazard survey for overhead line routes."
      icon={Footprints}
      entityLabel="line walk"
      addLabel="Add line walk"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['line_name', 'tower_number']}
      useList={lineWalks.useList}
      useCreate={lineWalks.useCreate}
      useUpdate={lineWalks.useUpdate}
      useRemove={lineWalks.useRemove}
    />
  )
}
