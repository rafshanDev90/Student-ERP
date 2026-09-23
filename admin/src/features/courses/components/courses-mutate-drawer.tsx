import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MultiSelect } from '@/components/multi-select'
import {
  courseFormSchema,
  type Course,
  type CourseFormValues,
} from '../data/schema'
import { courseTypes, formDefaultValues, levels, statuses, toFormValues } from '../data/data'
import {
  useCategories,
  useCreateCategory,
  useCreateCourse,
  useUpdateCourse,
} from '../hooks/use-courses'

type CourseMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Course
}

export function CoursesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: CourseMutateDrawerProps) {
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const isUpdate = !!currentRow

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: formDefaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(currentRow ? toFormValues(currentRow) : formDefaultValues)
    }
  }, [open, currentRow, form])

  const onSubmit = async (data: CourseFormValues) => {
    try {
      if (isUpdate && currentRow) {
        await updateCourse.mutateAsync({
          slug: currentRow.slug,
          payload: data,
        })
      } else {
        await createCourse.mutateAsync(data)
      }
      toast.success(isUpdate ? 'Course updated successfully.' : 'Course created successfully.')
      onOpenChange(false)
    } catch {
      // Error toast is handled globally by react-query
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Course</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the course by providing necessary info.'
              : 'Add a new course by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='courses-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. AI Basics 101' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder='A short summary of the course...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='thumbnailUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://...'
                      type='url'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. 7h 41m' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='courseType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select course type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='level'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select level' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isPopular'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs'>
                  <div className='space-y-0.5'>
                    <FormLabel>Featured</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <TagsField form={form} />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='courses-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function TagsField({ form }: { form: UseFormReturn<CourseFormValues> }) {
  const { data: categories = [] } = useCategories()
  const createCategory = useCreateCategory()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const options = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }))

  const handleCreateCategory = async () => {
    if (!newName.trim()) {
      toast.error('Category name is required.')
      return
    }
    try {
      const res = await createCategory.mutateAsync({ name: newName.trim() })
      const created = res.data as { _id?: string } | undefined
      if (created?._id) {
        const current = form.getValues('tags') ?? []
        form.setValue('tags', [...current, created._id])
      }
      setCreating(false)
      setNewName('')
      toast.success('Category created successfully.')
    } catch {
      // Error toast handled globally
    }
  }

  return (
    <FormField
      control={form.control}
      name='tags'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags / Categories</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              values={field.value ?? []}
              onValuesChange={field.onChange}
              placeholder='Select categories'
              searchPlaceholder='Search categories...'
              emptyText='No categories found.'
              footer={
                options.length > 0 && (
                  <div className='border-t p-2' role='none'>
                    <button
                      type='button'
                      onClick={() => setCreating(true)}
                      className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent'
                    >
                      <Plus className='size-4' />
                      New category
                    </button>
                  </div>
                )
              }
            />
          </FormControl>
          {creating && (
            <Dialog open onOpenChange={setCreating}>
              <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                  <DialogTitle>Create category</DialogTitle>
                  <DialogDescription>
                    A category groups courses together by topic.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-3'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='new-category-name'>Name</Label>
                    <Input
                      id='new-category-name'
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder='e.g. Machine Learning'
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setCreating(false)
                      setNewName('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type='button' onClick={handleCreateCategory}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </FormItem>
      )}
    />
  )
}