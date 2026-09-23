import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Course } from '../data/schema'

type CoursesDialogType = 'create' | 'update' | 'delete'

type CoursesContextType = {
  open: CoursesDialogType | null
  setOpen: (str: CoursesDialogType | null) => void
  currentRow: Course | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Course | null>>
}

const CoursesContext = React.createContext<CoursesContextType | null>(null)

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CoursesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Course | null>(null)

  return (
    <CoursesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CoursesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCoursesStore = () => {
  const coursesContext = React.useContext(CoursesContext)

  if (!coursesContext) {
    throw new Error('useCoursesStore has to be used within <CoursesProvider>')
  }

  return coursesContext
}