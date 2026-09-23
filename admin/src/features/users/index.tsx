import { AlertCircle, Loader2 } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsers } from './hooks/use-users'

export function Users() {
  const { data: users = [], isLoading, isError, refetch } = useUsers()

  return (
    <UsersProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Users</h2>
            <p className='text-muted-foreground'>
              Manage user roles. Changes apply to MongoDB and Clerk.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center gap-2 text-muted-foreground'>
            <Loader2 className='size-5 animate-spin' />
            Loading users...
          </div>
        ) : isError ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground'>
            <AlertCircle className='size-8' />
            <p>Failed to load users.</p>
            <button
              type='button'
              onClick={() => refetch()}
              className='text-sm text-primary underline underline-offset-4'
            >
              Try again
            </button>
          </div>
        ) : (
          <UsersTable data={users} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}