import {
  GraduationCap,
  LayoutDashboard,
  HelpCircle,
  Bell,
  Monitor,
  Palette,
  Settings,
  UserCog,
  Users,
  Wrench,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Administrator',
    email: 'admin@university.edu',
    avatar: '/images/shadcn-admin.png',
  },
  teams: [
    {
      name: 'Course Admin',
      logo: Command,
      plan: 'University ERP',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Courses',
          url: '/courses',
          icon: GraduationCap,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
          roles: ['admin'],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}