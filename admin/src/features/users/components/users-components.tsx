import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { roleBadges, roles } from '../data/data'
import { type User } from '../data/schema'
import { useUsersStore } from './users-provider'

export function UserAvatar({ user }: { user: User }) {
  const initials = (user.name || user.email)
    .split(/[\s@]/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Avatar className='size-8 rounded-full'>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
      <AvatarFallback className='rounded-full'>{initials}</AvatarFallback>
    </Avatar>
  )
}

export function RoleBadge({ role }: { role: User['role'] }) {
  const roleMeta = roles.find((candidate) => candidate.value === role)
  if (!roleMeta) return null

  return (
    <Badge
      variant='outline'
      className={`gap-1 whitespace-nowrap ${roleBadges[role] ?? ''}`}
    >
      {roleMeta.icon && <roleMeta.icon className='size-3.5' />}
      {roleMeta.label}
    </Badge>
  )
}

export function RoleActions({ user }: { user: User }) {
  const { setOpen, setCurrentRow } = useUsersStore()

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Edit role'
      onClick={() => {
        setCurrentRow(user)
        setOpen('edit-role')
      }}
    >
      <Pencil />
    </Button>
  )
}