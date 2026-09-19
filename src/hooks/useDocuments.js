import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

const key = ['documents']
const select = '*, permit:permits(id, permit_number, title), allocation:allocations(id, allocation_number, title)'

export function useDocuments(filters = {}) {
  return useQuery({
    queryKey: [...key, 'list', filters],
    queryFn: async () => {
      let query = supabase.from('documents').select(select).order('created_at', { ascending: false })
      for (const [field, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '') continue
        query = query.eq(field, value)
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useUploadDocument(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, title, category, permit_id, allocation_id, uploaded_by }) => {
      const path = `${uploaded_by}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: title || file.name,
          category,
          file_path: path,
          file_size: file.size,
          mime_type: file.type,
          permit_id: permit_id || null,
          allocation_id: allocation_id || null,
          uploaded_by,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: key })
      options.onSuccess?.(data)
    },
    onError: (error) => {
      toast.error(error.message || 'Upload failed')
      options.onError?.(error)
    },
  })
}

export function useDeleteDocument(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (doc) => {
      await supabase.storage.from('documents').remove([doc.file_path])
      const { error } = await supabase.from('documents').delete().eq('id', doc.id)
      if (error) throw error
      return doc.id
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: key })
      options.onSuccess?.(data)
    },
    onError: (error) => {
      toast.error(error.message || 'Delete failed')
      options.onError?.(error)
    },
  })
}

export async function getDocumentUrl(path) {
  const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 60 * 10)
  if (error) throw error
  return data.signedUrl
}
