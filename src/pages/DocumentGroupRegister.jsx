import { FolderKanban } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { documentGroups } from '@/hooks/useEntities'
import { DOCUMENT_CATEGORIES } from '@/lib/constants'

const FIELDS = [
  { name: 'name', label: 'Group name', required: true },
  { name: 'category', label: 'Category', type: 'select', options: DOCUMENT_CATEGORIES, required: true },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
]

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'sort_order', label: 'Sort order', hideOnMobile: true },
]

export default function DocumentGroupRegister() {
  return (
    <SimpleRegister
      title="Document groups"
      description="Folders for organizing documents within a category."
      icon={FolderKanban}
      entityLabel="group"
      addLabel="Add group"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name', 'category']}
      useList={documentGroups.useList}
      useCreate={documentGroups.useCreate}
      useUpdate={documentGroups.useUpdate}
      useRemove={documentGroups.useRemove}
    />
  )
}
