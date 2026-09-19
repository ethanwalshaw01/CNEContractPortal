export const PERMIT_TYPES = [
  { value: 'general', label: 'General Works' },
  { value: 'hot_work', label: 'Hot Work' },
  { value: 'excavation', label: 'Excavation' },
  { value: 'overhead_line', label: 'Overhead Line' },
  { value: 'confined_space', label: 'Confined Space' },
  { value: 'working_at_height', label: 'Working at Height' },
]

export const PERMIT_STATUSES = ['draft', 'issued', 'live', 'completed', 'cancelled']

export const ALLOCATION_STATUSES = ['draft', 'pending_acceptance', 'accepted', 'live', 'completed', 'archived']

export const RISK_LEVELS = ['low', 'medium', 'high']

export const DOCUMENT_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'rams', label: 'RAMS' },
  { value: 'permit', label: 'Permit' },
  { value: 'allocation', label: 'Allocation' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'drawing', label: 'Drawing' },
]
