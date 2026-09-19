import { Route } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { mapRoutes } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'label', label: 'Route name', required: true },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

const COLUMNS = [
  { key: 'label', label: 'Name' },
  { key: 'notes', label: 'Notes', hideOnMobile: true },
]

export default function MapRoutesPage() {
  return (
    <SimpleRegister
      title="Map routes"
      description="Saved access routes and coordinate sets."
      icon={Route}
      entityLabel="route"
      addLabel="Add route"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['label']}
      useList={mapRoutes.useList}
      useCreate={mapRoutes.useCreate}
      useUpdate={mapRoutes.useUpdate}
      useRemove={mapRoutes.useRemove}
    />
  )
}
