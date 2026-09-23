import { useMemo, useState } from 'react'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  values: string[]
  onValuesChange: (values: string[]) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  footer?: React.ReactNode
  maxDisplay?: number
}

export function MultiSelect({
  options,
  values,
  onValuesChange,
  placeholder = 'Select...',
  emptyText = 'No results found.',
  searchPlaceholder = 'Search...',
  footer,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = useMemo(
    () => options.filter((option) => values.includes(option.value)),
    [options, values]
  )

  const toggle = (value: string) => {
    onValuesChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='h-9 w-full justify-between px-3 font-normal'
        >
          <span className='flex flex-wrap items-center gap-1'>
            {selected.length === 0 ? (
              <span className='text-muted-foreground'>{placeholder}</span>
            ) : (
              <>
                {selected
                  .slice(0, maxDisplay)
                  .map((option) => (
                    <Badge key={option.value} variant='secondary'>
                      {option.label}
                    </Badge>
                  ))}
                {selected.length > maxDisplay && (
                  <Badge variant='secondary'>
                    +{selected.length - maxDisplay}
                  </Badge>
                )}
              </>
            )}
          </span>
          <ChevronsUpDown className='ms-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full min-w-60 p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
            className='h-9'
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className='max-h-40'>
                {options
                  .filter((option) =>
                    option.label.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggle(option.value)}
                    >
                      <Checkbox
                        checked={values.includes(option.value)}
                        onCheckedChange={() => toggle(option.value)}
                        aria-label={option.label}
                      />
                      <span className='ms-2'>{option.label}</span>
                      <CheckIcon
                        className={cn(
                          'ms-auto h-4 w-4',
                          values.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </ScrollArea>
            </CommandGroup>
            {footer}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}