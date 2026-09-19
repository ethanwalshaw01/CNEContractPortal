import { CheckSquare } from 'lucide-react'
import SimpleRegister from '@/components/common/SimpleRegister'
import { todos, profilesList } from '@/hooks/useEntities'
import { titleCase } from '@/lib/utils'

const PRIORITIES = ['low', 'medium', 'high'].map((v) => ({ value: v, label: titleCase(v) }))

export default function TodoListPage() {
  const { data: profiles } = profilesList.useList()

  const fields = [
    { name: 'description', label: 'Description', required: true },
    { name: 'priority', label: 'Priority', type: 'select', options: PRIORITIES },
    {
      name: 'assigned_to',
      label: 'Assigned to',
      type: 'select',
      options: (profiles || []).map((p) => ({ value: p.id, label: p.full_name })),
    },
    { name: 'completed', label: 'Completed', type: 'checkbox' },
  ]

  const columns = [
    { key: 'description', label: 'Task' },
    { key: 'priority', label: 'Priority', render: (r) => titleCase(r.priority) },
    { key: 'completed', label: 'Done', render: (r) => (r.completed ? 'Yes' : 'No') },
  ]

  return (
    <SimpleRegister
      title="To-do list"
      description="Tasks assigned to your team."
      icon={CheckSquare}
      entityLabel="task"
      addLabel="Add task"
      fields={fields}
      columns={columns}
      searchKeys={['description']}
      useList={todos.useList}
      useCreate={todos.useCreate}
      useUpdate={todos.useUpdate}
      useRemove={todos.useRemove}
    />
  )
}
