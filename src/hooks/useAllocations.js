import { createEntityHooks } from './useEntity'

const select = '*, contractor:contractors(id, company_name), permit:permits(id, permit_number, title)'

export const {
  key: allocationsKey,
  useList: useAllocations,
  useOne: useAllocation,
  useCreate: useCreateAllocation,
  useUpdate: useUpdateAllocation,
  useRemove: useDeleteAllocation,
} = createEntityHooks('allocations', { select })
