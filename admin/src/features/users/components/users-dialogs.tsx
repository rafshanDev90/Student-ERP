import { useUsersStore } from './users-provider'
import { UsersRoleDialog } from './users-role-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow } = useUsersStore()

  return (
    <UsersRoleDialog
      key={currentRow ? `role-${currentRow._id}` : 'role'}
      open={open === 'edit-role'}
      onOpenChange={() => setOpen('edit-role')}
      currentRow={currentRow ?? undefined}
    />
  )
}