import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { FolderOpen, Upload, Download, Trash2, FileText, File as FileIcon } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { useDocuments, useUploadDocument, useDeleteDocument, getDocumentUrl } from '@/hooks/useDocuments'
import { DOCUMENT_CATEGORIES } from '@/lib/constants'
import { formatDateTime, titleCase } from '@/lib/utils'

function formatBytes(bytes) {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i += 1
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

export default function DocumentLibrary() {
  const { user } = useAuth()
  const [category, setCategory] = useState('')
  const { data: documents, isLoading } = useDocuments(category ? { category } : {})
  const uploadDocument = useUploadDocument()
  const deleteDocument = useDeleteDocument()

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState(null)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState('general')
  const fileInputRef = useRef(null)

  const filtered = useMemo(() => {
    if (!documents) return []
    const q = search.trim().toLowerCase()
    if (!q) return documents
    return documents.filter((d) => d.title.toLowerCase().includes(q))
  }, [documents, search])

  const resetUploadForm = () => {
    setFile(null)
    setTitle('')
    setUploadCategory('general')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Choose a file to upload')
      return
    }
    uploadDocument.mutate(
      { file, title: title || file.name, category: uploadCategory, uploaded_by: user.id },
      {
        onSuccess: () => {
          toast.success('Document uploaded')
          setDialogOpen(false)
          resetUploadForm()
        },
      }
    )
  }

  const handleDownload = async (doc) => {
    try {
      const url = await getDocumentUrl(doc.file_path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      toast.error(err.message || 'Could not open document')
    }
  }

  return (
    <div>
      <PageHeader
        title="Document library"
        description="RAMS, certificates, drawings and other site paperwork."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Upload className="mr-1.5 h-4 w-4" />
            Upload document
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={category || 'all'} onValueChange={(v) => setCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {DOCUMENT_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SearchInput value={search} onChange={setSearch} placeholder="Search documents…" className="sm:w-72" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents yet"
          description="Upload RAMS, certificates or drawings to keep everything in one place."
          action={
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Upload className="mr-1.5 h-4 w-4" />
              Upload document
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  {doc.mime_type?.includes('pdf') ? <FileText className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(doc.created_at)} {doc.file_size ? `· ${formatBytes(doc.file_size)}` : ''}
                  </p>
                </div>
                <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                  {titleCase(doc.category)}
                </Badge>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)} aria-label="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmDeleteDoc(doc)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetUploadForm()
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null
                  setFile(f)
                  if (f && !title) setTitle(f.name)
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc-title">Title</Label>
              <Input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadDocument.isPending}>
                {uploadDocument.isPending ? 'Uploading…' : 'Upload'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDeleteDoc)}
        onOpenChange={(open) => !open && setConfirmDeleteDoc(null)}
        title="Delete this document?"
        description="This action can't be undone."
        confirmLabel="Delete"
        loading={deleteDocument.isPending}
        onConfirm={() =>
          deleteDocument.mutate(confirmDeleteDoc, {
            onSuccess: () => {
              toast.success('Document deleted')
              setConfirmDeleteDoc(null)
            },
          })
        }
      />
    </div>
  )
}
