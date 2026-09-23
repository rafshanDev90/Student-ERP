import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import {
  type User,
  userRoleFormSchema,
  type UserRoleFormValues,
} from '../data/schema'
import { useUpdateUserRole } from '../hooks/use-users'

interface UsersRoleDialogProps {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersRoleDialog({
  currentRow,
  open,
  onOpenChange,
}: UsersRoleDialogProps) {
  const updateRole = useUpdateUserRole()

  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: {
      role: currentRow?.role ?? 'student',
    },
  })

  const onSubmit = async (values: UserRoleFormValues) => {
    if (!currentRow) return
    try {
      await updateRole.mutateAsync({ id: currentRow._id, role: values.role })
      toast.success(`Role updated to "${values.role}" for ${currentRow.name}.`)
      form.reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to update role.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Role — {currentRow?.name}</DialogTitle>
          <DialogDescription>
            Assign a role for this user. The change is applied to both MongoDB
            and Clerk, so permissions update on their next sign-in.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-role-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select a role'
                    items={roles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='user-role-form'
            disabled={updateRole.isPending}
          >
            {updateRole.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}