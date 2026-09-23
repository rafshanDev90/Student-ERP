import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/react'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Footer } from '@/components/layout/footer'
import { SkipToMain } from '@/components/skip-to-main'

/**
 * Blocks access to authenticated pages until a real Clerk session exists.
 * Only mounted when a publishable key is configured.
 */
export function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/clerk/sign-in', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded) {
    return (
      <div className='flex flex-1 items-center justify-center p-6'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary' />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to='/clerk/sign-in' replace />
  }

  return null
}

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const hasClerk = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <div className='flex min-h-0 flex-1 flex-col'>
              {hasClerk && <AuthGuard />}
              {children ?? <Outlet />}
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}