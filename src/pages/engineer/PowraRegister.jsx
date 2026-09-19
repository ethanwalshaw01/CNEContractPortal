import { ShieldAlert } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { powraAssessments, itemPacks } from '@/hooks/useEntities'
import { formatDate } from '@/lib/utils'

export default function PowraRegister() {
  const { data: packs } = itemPacks.useList()

  const fields = [
    {
      name: 'item_pack_id',
      label: 'Item pack',
      type: 'select',
      required: true,
      options: (packs || []).map((p) => ({ value: p.id, label: p.scaffold_item_number })),
    },
    { name: 'assessment_date', label: 'Assessment date', type: 'date', required: true },
  ]

  const columns = [
    { key: 'item_pack', label: 'Item pack', render: (r) => r.item_pack?.scaffold_item_number || '—' },
    { key: 'assessment_date', label: 'Date', render: (r) => formatDate(r.assessment_date) },
  ]

  return (
    <SimpleRegister
      title="POWRA register"
      description="Point of Work Risk Assessments recorded against scaffold item packs."
      icon={ShieldAlert}
      entityLabel="assessment"
      addLabel="Add assessment"
      fields={fields}
      columns={columns}
      useList={powraAssessments.useList}
      useCreate={powraAssessments.useCreate}
      useUpdate={powraAssessments.useUpdate}
      useRemove={powraAssessments.useRemove}
    />
  )
}
