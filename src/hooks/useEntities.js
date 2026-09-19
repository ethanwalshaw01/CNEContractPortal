import { createEntityHooks } from './useEntity'

// Simple, mostly-flat entities share the generic CRUD factory. Grouped in one
// file since each is a one-line instantiation — see useEntity.js for the
// shared list/one/create/update/remove implementation.

export const gs6Entries = createEntityHooks('gs6_entries')
export const havsLogEntries = createEntityHooks('havs_log_entries')
export const lineWalks = createEntityHooks('line_walks')
export const conductorHeightLogs = createEntityHooks('conductor_height_logs')
export const plantEquipment = createEntityHooks('plant_equipment', { orderBy: 'name', ascending: true })
export const plantClearanceLogs = createEntityHooks('plant_clearance_logs')
export const preUseChecks = createEntityHooks('pre_use_checks', {
  select: '*, equipment:plant_equipment(id, name)',
})
export const powraAssessments = createEntityHooks('powra_assessments', {
  select: '*, item_pack:item_packs(id, scaffold_item_number)',
})
export const itemPacks = createEntityHooks('item_packs', { orderBy: 'scaffold_item_number', ascending: true })

export const trainees = createEntityHooks('trainees', { orderBy: 'name', ascending: true })
export const trainingCerts = createEntityHooks('training_certs', {
  select: '*, trainee:trainees(id, name)',
})

export const permitTemplates = createEntityHooks('permit_templates', { orderBy: 'name', ascending: true })
export const groundDisturbancePermits = createEntityHooks('ground_disturbance_permits', {
  select: '*, contractor:contractors(id, company_name)',
})
export const allocationTemplates = createEntityHooks('allocation_templates', { orderBy: 'name', ascending: true })
export const allocationPrintTemplates = createEntityHooks('allocation_print_templates', {
  orderBy: 'name',
  ascending: true,
})

export const passFormTemplates = createEntityHooks('pass_form_templates', { orderBy: 'name', ascending: true })
export const passFormLogs = createEntityHooks('pass_form_logs')

export const documentGroups = createEntityHooks('document_groups', { orderBy: 'sort_order', ascending: true })
export const pdfForms = createEntityHooks('pdf_forms', { orderBy: 'name', ascending: true })

export const photoArchive = createEntityHooks('photo_archive')
export const libraryImages = createEntityHooks('library_images', { orderBy: 'label', ascending: true })
export const mapRoutes = createEntityHooks('map_routes', { orderBy: 'label', ascending: true })
export const savedSignatures = createEntityHooks('saved_signatures')
export const todos = createEntityHooks('todos')

export const customTiles = createEntityHooks('custom_tiles', { orderBy: 'sort_order', ascending: true })
export const hiddenTiles = createEntityHooks('hidden_tiles')
export const iconOverrides = createEntityHooks('icon_overrides')
export const appSettings = createEntityHooks('app_settings', { orderBy: 'key', ascending: true })
export const appAccounts = createEntityHooks('app_accounts', {
  select: '*, profile:profiles(id, full_name, role)',
})

export const profilesList = createEntityHooks('profiles', { orderBy: 'full_name', ascending: true })
