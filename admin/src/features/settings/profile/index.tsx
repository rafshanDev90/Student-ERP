import { UserProfile } from '@clerk/react'
import { ContentSection } from '../components/content-section'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc='Manage your account settings via Clerk.'
    >
      <UserProfile />
    </ContentSection>
  )
}