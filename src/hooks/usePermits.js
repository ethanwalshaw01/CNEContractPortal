import { createEntityHooks } from './useEntity'

const select = '*, contractor:contractors(id, company_name)'

export const {
  key: permitsKey,
  useList: usePermits,
  useOne: usePermit,
  useCreate: useCreatePermit,
  useUpdate: useUpdatePermit,
  useRemove: useDeletePermit,
} = createEntityHooks('permits', { select })
