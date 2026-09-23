import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Course } from '../data/schema'
import { useDeleteCourse } from '../hooks/use-courses'

type CourseMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function CoursesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CourseMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const deleteCourse = useDeleteCourse()

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original as Course)

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    onOpenChange(false)

    try {
      await Promise.all(
        selectedRows.map((course) => deleteCourse.mutateAsync(course.slug))
      )
      setValue('')
      table.resetRowSelection()
      toast.success(
        `Deleted ${selectedRows.length} course${selectedRows.length > 1 ? 's' : ''}`
      )
    } catch {
      toast.error('Failed to delete some courses.')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='courses-multi-delete-form'
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'courses' : 'course'}
        </span>
      }
      desc={
        <form
          id='courses-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete the selected courses? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirm by typing '{CONFIRM_WORD}':</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}