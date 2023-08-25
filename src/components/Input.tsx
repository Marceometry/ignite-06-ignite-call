import { TextInput } from '@ignite-ui/react'
import { ComponentProps, ElementRef, forwardRef } from 'react'

export const Input = forwardRef<
  ElementRef<typeof TextInput>,
  Partial<ComponentProps<typeof TextInput>>
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <TextInput {...props} ref={ref} />
})

Input.displayName = 'TextInput'
