import { Images } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { photoArchive } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'label', label: 'Label', required: true },
  { name: 'original_photo_url', label: 'Photo URL', required: true },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

const COLUMNS = [
  { key: 'label', label: 'Label' },
  { key: 'notes', label: 'Notes', hideOnMobile: true },
]

export default function PhotoArchivePage() {
  return (
    <SimpleRegister
      title="Photo archive"
      description="Site photo gallery."
      icon={Images}
      entityLabel="photo"
      addLabel="Add photo"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['label']}
      useList={photoArchive.useList}
      useCreate={photoArchive.useCreate}
      useUpdate={photoArchive.useUpdate}
      useRemove={photoArchive.useRemove}
    />
  )
}
