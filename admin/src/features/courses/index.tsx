import { AlertCircle, Loader2 } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useSessionStore } from '@/stores/session-store'
import { CoursesDialogs } from './components/courses-dialogs'
import { CoursesPrimaryButtons } from './components/courses-primary-buttons'
import { CoursesProvider } from './components/courses-provider'
import { CoursesTable } from './components/courses-table'
import { useCourses } from './hooks/use-courses'

export function Courses() {
  const { data: courses = [], isLoading, isError, refetch } = useCourses()
  const role = useSessionStore((state) => state.user?.role ?? 'student')

  return (
    <CoursesProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Courses</h2>
            <p className='text-muted-foreground'>
              {role === 'admin'
                ? 'Manage every course in the university catalog.'
                : 'Create and customize the courses you teach.'}
            </p>
          </div>
          <CoursesPrimaryButtons />
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center gap-2 text-muted-foreground'>
            <Loader2 className='size-5 animate-spin' />
            Loading courses...
          </div>
        ) : isError ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground'>
            <AlertCircle className='size-8' />
            <p>Failed to load courses.</p>
            <button
              type='button'
              onClick={() => refetch()}
              className='text-sm text-primary underline underline-offset-4'
            >
              Try again
            </button>
          </div>
        ) : (
          <CoursesTable data={courses} />
        )}
      </Main>

      <CoursesDialogs />
    </CoursesProvider>
  )
}