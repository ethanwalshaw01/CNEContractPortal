import { PenTool } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { savedSignatures } from '@/hooks/useEntities'
import { useAuth } from '@/context/AuthContext'

export default function SavedSignaturesPage() {
  const { user } = useAuth()

  const fields = [
    { name: 'name', label: 'Signature name', required: true },
    { name: 'file_url', label: 'Signature image URL', required: true },
  ]

  const columns = [{ key: 'name', label: 'Name' }]

  return (
    <SimpleRegister
      title="Saved signatures"
      description="Reusable signatures for quickly signing documents and forms."
      icon={PenTool}
      entityLabel="signature"
      addLabel="Add signature"
      fields={fields}
      columns={columns}
      searchKeys={['name']}
      useList={() => savedSignatures.useList({ profile_id: user.id })}
      useCreate={savedSignatures.useCreate}
      useUpdate={savedSignatures.useUpdate}
      useRemove={savedSignatures.useRemove}
      extraDefaults={{ profile_id: user.id }}
      withCreatedBy={false}
    />
  )
}
