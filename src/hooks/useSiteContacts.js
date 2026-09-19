import { createEntityHooks } from './useEntity'

export const {
  useList: useSiteContacts,
  useOne: useSiteContact,
  useCreate: useCreateSiteContact,
  useUpdate: useUpdateSiteContact,
  useRemove: useDeleteSiteContact,
} = createEntityHooks('site_contacts', { orderBy: 'name', ascending: true })
