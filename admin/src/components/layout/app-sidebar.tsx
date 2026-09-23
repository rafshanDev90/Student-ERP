import { useLayout } from '@/context/layout-provider'
import { useSessionStore } from '@/stores/session-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { type NavGroup as NavGroupProps } from './types'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const sessionUser = useSessionStore((state) => state.user)
  const role = sessionUser?.role ?? 'student'

  const goRole = (navGroups: NavGroupProps[]) =>
    navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => !item.roles || item.roles.includes(role)
        ),
      }))
      .filter((group) => group.items.length > 0)

  const defaultUser = sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {goRole(sidebarData.navGroups).map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            sessionUser
              ? {
                  name: sessionUser.name,
                  email: sessionUser.email,
                  avatar: '',
                }
              : defaultUser
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}