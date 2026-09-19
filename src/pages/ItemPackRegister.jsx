import { Package } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { itemPacks } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'scaffold_item_number', label: 'Scaffold item number', required: true },
  { name: 'guard_side_of_crossing', label: 'Guard side of crossing' },
  { name: 'method_statement_name', label: 'Method statement name' },
  { name: 'item_rams_name', label: 'Item RAMS name' },
  { name: 'ohl_authorization_doc_name', label: 'OHL authorization doc name' },
  { name: 'user_visible', label: 'Visible to contractors', type: 'checkbox' },
]

const COLUMNS = [
  { key: 'scaffold_item_number', label: 'Item number' },
  { key: 'guard_side_of_crossing', label: 'Guard side', hideOnMobile: true },
  { key: 'method_statement_name', label: 'Method statement', hideOnMobile: true },
  { key: 'user_visible', label: 'Visible', render: (r) => (r.user_visible ? 'Yes' : 'No') },
]

export default function ItemPackRegister() {
  return (
    <SimpleRegister
      title="Item packs"
      description="Scaffold-crossing item packs bundling guard, handover and RAMS documentation."
      icon={Package}
      entityLabel="item pack"
      addLabel="Add item pack"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['scaffold_item_number']}
      useList={itemPacks.useList}
      useCreate={itemPacks.useCreate}
      useUpdate={itemPacks.useUpdate}
      useRemove={itemPacks.useRemove}
    />
  )
}
