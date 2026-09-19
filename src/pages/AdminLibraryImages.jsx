import { Image } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { libraryImages } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'label', label: 'Label', required: true },
  { name: 'url', label: 'Image URL', required: true },
]

const COLUMNS = [{ key: 'label', label: 'Label' }]

export default function AdminLibraryImages() {
  return (
    <SimpleRegister
      title="Image library"
      description="Reusable branding and tile images."
      icon={Image}
      entityLabel="image"
      addLabel="Add image"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['label']}
      useList={libraryImages.useList}
      useCreate={libraryImages.useCreate}
      useUpdate={libraryImages.useUpdate}
      useRemove={libraryImages.useRemove}
      withCreatedBy={false}
    />
  )
}
