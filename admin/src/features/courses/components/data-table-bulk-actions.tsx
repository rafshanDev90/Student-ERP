import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { CircleArrowUp, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { statuses, toFormValues } from '../data/data'
import { type Course } from '../data/schema'
import { useUpdateCourse } from '../hooks/use-courses'
import { CoursesMultiDeleteDialog } from './courses-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function CourseBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const updateCourse = useUpdateCourse()

  const selectedRows = table.getFilteredSelectedRowModel().rows as unknown as {
    original: Course
    id: string
  }[]

  const handleBulkStatusChange = async (status: string) => {
    const courses = selectedRows.map((row) => row.original)
    try {
      await Promise.all(
        courses.map((course) =>
          updateCourse.mutateAsync({
            slug: course.slug,
            payload: { ...toFormValues(course), status },
          })
        )
      )
      toast.success(
        `Status updated to "${status}" for ${courses.length} course${courses.length > 1 ? 's' : ''}.`
      )
      table.resetRowSelection()
    } catch {
      toast.error('Failed to update status for some courses.')
    }
  }

  const handleBulkExport = () => {
    const courses = selectedRows.map((row) => row.original)

    const header = ['title', 'slug', 'status', 'courseType', 'level', 'duration']
    const rows = courses.map((c) =>
      [c.title, c.slug, c.status, c.courseType, c.level, c.duration]
        .map((value) => `"${String(value ?? '').split('"').join('""')}"`)
        .join(',')
    )
    const csv = [header.join(','), ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'courses.csv'
    link.click()
    URL.revokeObjectURL(url)
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='course'>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label='Update status'
                  title='Update status'
                >
                  <CircleArrowUp />
                  <span className='sr-only'>Update status</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update status</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.icon && (
                  <status.icon className='size-4 text-muted-foreground' />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkExport}
              className='size-8'
              aria-label='Export courses'
              title='Export courses'
            >
              <Download />
              <span className='sr-only'>Export courses</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export courses as CSV</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected courses'
              title='Delete selected courses'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected courses</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected courses</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <CoursesMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}