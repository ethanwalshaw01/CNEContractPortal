import { Truck } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { plantEquipment } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'specs', label: 'Specs', type: 'textarea' },
  { name: 'duty_chart_image', label: 'Duty chart image URL' },
]

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description', hideOnMobile: true },
]

export default function PlantEquipmentPage() {
  return (
    <SimpleRegister
      title="Plant & equipment"
      description="Catalog of plant and equipment used on site."
      icon={Truck}
      entityLabel="equipment"
      addLabel="Add equipment"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name', 'description']}
      useList={plantEquipment.useList}
      useCreate={plantEquipment.useCreate}
      useUpdate={plantEquipment.useUpdate}
      useRemove={plantEquipment.useRemove}
    />
  )
}
