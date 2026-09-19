import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

async function countRows(table, filters = {}) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  for (const [field, value] of Object.entries(filters)) {
    query = query.eq(field, value)
  }
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [livePermits, issuedPermits, pendingAllocations, liveAllocations, contractors, siteContacts] =
        await Promise.all([
          countRows('permits', { status: 'live' }),
          countRows('permits', { status: 'issued' }),
          countRows('allocations', { status: 'pending_acceptance' }),
          countRows('allocations', { status: 'live' }),
          countRows('contractors', { status: 'active' }),
          countRows('site_contacts'),
        ])
      return { livePermits, issuedPermits, pendingAllocations, liveAllocations, contractors, siteContacts }
    },
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const [permits, allocations] = await Promise.all([
        supabase
          .from('permits')
          .select('id, permit_number, title, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('allocations')
          .select('id, allocation_number, title, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])
      if (permits.error) throw permits.error
      if (allocations.error) throw allocations.error

      const items = [
        ...permits.data.map((p) => ({ ...p, type: 'permit', number: p.permit_number })),
        ...allocations.data.map((a) => ({ ...a, type: 'allocation', number: a.allocation_number })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      return items.slice(0, 8)
    },
  })
}
