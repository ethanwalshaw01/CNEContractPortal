import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

/**
 * Builds a set of react-query hooks (list/one/create/update/remove) for a
 * Supabase table, sharing the query key so mutations invalidate the list.
 */
export function createEntityHooks(table, { orderBy = 'created_at', ascending = false, select = '*' } = {}) {
  const key = [table]

  function useList(filters = {}) {
    return useQuery({
      queryKey: [...key, 'list', filters],
      queryFn: async () => {
        let query = supabase.from(table).select(select).order(orderBy, { ascending })
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

  function useOne(id) {
    return useQuery({
      queryKey: [...key, 'one', id],
      queryFn: async () => {
        const { data, error } = await supabase.from(table).select(select).eq('id', id).single()
        if (error) throw error
        return data
      },
      enabled: Boolean(id),
    })
  }

  function useCreate(options = {}) {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload) => {
        const { data, error } = await supabase.from(table).insert(payload).select().single()
        if (error) throw error
        return data
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: key })
        options.onSuccess?.(data)
      },
      onError: (error) => {
        toast.error(error.message || 'Something went wrong')
        options.onError?.(error)
      },
    })
  }

  function useUpdate(options = {}) {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...patch }) => {
        const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single()
        if (error) throw error
        return data
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: key })
        options.onSuccess?.(data)
      },
      onError: (error) => {
        toast.error(error.message || 'Something went wrong')
        options.onError?.(error)
      },
    })
  }

  function useRemove(options = {}) {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id) => {
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) throw error
        return id
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: key })
        options.onSuccess?.(data)
      },
      onError: (error) => {
        toast.error(error.message || 'Something went wrong')
        options.onError?.(error)
      },
    })
  }

  return { key, useList, useOne, useCreate, useUpdate, useRemove }
}
