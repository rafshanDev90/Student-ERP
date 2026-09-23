import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCoursesStore } from './courses-provider'

export function CoursesPrimaryButtons() {
  const { setOpen } = useCoursesStore()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Course</span> <Plus size={18} />
      </Button>
    </div>
  )
}