import { HardHat } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { groundDisturbancePermits } from '@/hooks/useEntities'
import { useContractors } from '@/hooks/useContractors'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/utils'

const PERMIT_TYPES = [
  { value: 'GD', label: 'Ground Disturbance' },
  { value: 'HW', label: 'Hot Work' },
  { value: 'PILE', label: 'Piling' },
  { value: 'Pump', label: 'Pump' },
  { value: 'PTW', label: 'Scaffold Permit to Work' },
]

const STATUSES = ['draft', 'issued', 'certified', 'in_progress', 'completed', 'cancelled'].map((s) => ({
  value: s,
  label: s,
}))

export default function GroundDisturbanceRegister() {
  const { data: contractorsList } = useContractors({ status: 'active' })

  const fields = [
    { name: 'project_name', label: 'Project name', required: true },
    { name: 'site_location', label: 'Site location', required: true },
    { name: 'permit_type', label: 'Permit type', type: 'select', options: PERMIT_TYPES },
    { name: 'status', label: 'Status', type: 'select', options: STATUSES },
    {
      name: 'contractor_id',
      label: 'Contractor',
      type: 'select',
      options: (contractorsList || []).map((c) => ({ value: c.id, label: c.company_name })),
    },
    { name: 'works_description', label: 'Works description', type: 'textarea' },
    { name: 'permit_start_date', label: 'Start date', type: 'date' },
    { name: 'permit_completion_date', label: 'Completion date', type: 'date' },
  ]

  const columns = [
    { key: 'project_name', label: 'Project' },
    { key: 'permit_type', label: 'Type' },
    { key: 'contractor', label: 'Contractor', hideOnMobile: true, render: (r) => r.contractor?.company_name || '—' },
    { key: 'permit_start_date', label: 'Start', hideOnMobile: true, render: (r) => formatDate(r.permit_start_date) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <SimpleRegister
      title="Ground disturbance & specialist permits"
      description="Ground disturbance, hot work, piling, pump and scaffold PTW permits."
      icon={HardHat}
      entityLabel="permit"
      addLabel="New permit"
      fields={fields}
      columns={columns}
      searchKeys={['project_name', 'site_location']}
      useList={groundDisturbancePermits.useList}
      useCreate={groundDisturbancePermits.useCreate}
      useUpdate={groundDisturbancePermits.useUpdate}
      useRemove={groundDisturbancePermits.useRemove}
    />
  )
}
