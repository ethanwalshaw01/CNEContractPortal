import { FileType2 } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { pdfForms } from '@/hooks/useEntities'

const FIELDS = [
  { name: 'name', label: 'Form name', required: true },
  { name: 'pdf_url', label: 'PDF URL', required: true },
]

const COLUMNS = [{ key: 'name', label: 'Name' }]

export default function PdfFormRegister() {
  return (
    <SimpleRegister
      title="PDF form library"
      description="Reusable fillable PDF form definitions (metadata only — the field overlay builder isn't part of this rebuild)."
      icon={FileType2}
      entityLabel="form"
      addLabel="Add form"
      fields={FIELDS}
      columns={COLUMNS}
      searchKeys={['name']}
      useList={pdfForms.useList}
      useCreate={pdfForms.useCreate}
      useUpdate={pdfForms.useUpdate}
      useRemove={pdfForms.useRemove}
    />
  )
}
