import { useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { trainees } from '@/hooks/useEntities'

const CARD_PROVIDERS = [
  { value: '', label: 'None' },
  { value: 'cscs', label: 'CSCS' },
  { value: 'npors', label: 'NPORS' },
  { value: 'ecs', label: 'ECS' },
]

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'card_provider', label: 'Card provider', type: 'select', options: CARD_PROVIDERS },
  { name: 'card_number', label: 'Card number' },
]

export default function TraineeRegister() {
  const navigate = useNavigate()

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'card_provider', label: 'Card provider', render: (r) => (r.card_provider ? r.card_provider.toUpperCase() : '—') },
    { key: 'card_number', label: 'Card number', hideOnMobile: true },
  ]

  return (
    <SimpleRegister
      title="Trainees"
      description="Operatives holding training certificates and competency cards."
      icon={GraduationCap}
      entityLabel="trainee"
      addLabel="Add trainee"
      fields={FIELDS}
      columns={columns.map((c) => (c.key === 'name' ? { ...c, render: (r) => <RowLink row={r} navigate={navigate} /> } : c))}
      searchKeys={['name', 'card_number']}
      useList={trainees.useList}
      useCreate={trainees.useCreate}
      useUpdate={trainees.useUpdate}
      useRemove={trainees.useRemove}
    />
  )
}

function RowLink({ row, navigate }) {
  return (
    <button
      className="text-left font-medium text-primary hover:underline"
      onClick={(e) => {
        e.stopPropagation()
        navigate(`/trainees/${row.id}`)
      }}
    >
      {row.name}
    </button>
  )
}
