import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CoursesMutateDrawer } from './courses-mutate-drawer'
import { useCoursesStore } from './courses-provider'
import { useDeleteCourse } from '../hooks/use-courses'

export function CoursesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCoursesStore()
  const deleteCourse = useDeleteCourse()

  return (
    <>
      <CoursesMutateDrawer
        key='course-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <CoursesMutateDrawer
            key={`course-update-${currentRow.slug}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='course-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              deleteCourse
                .mutateAsync(currentRow.slug)
                .then(() => {
                  toast.success('Course deleted successfully.')
                })
                .catch(() => {
                  // Error toast handled globally
                })
            }}
            className='max-w-md'
            title={`Delete this course: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete the course{' '}
                <strong>{currentRow.title}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}