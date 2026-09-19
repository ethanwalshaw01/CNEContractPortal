import { createEntityHooks } from './useEntity'

export const {
  useList: useContractors,
  useOne: useContractor,
  useCreate: useCreateContractor,
  useUpdate: useUpdateContractor,
  useRemove: useDeleteContractor,
} = createEntityHooks('contractors', { orderBy: 'company_name', ascending: true })
