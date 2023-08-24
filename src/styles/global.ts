import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    color: '$gray100',
    backgroundColor: '$gray900',
    fontFamily: '$default',
    '-webkit-font-smoothing': 'antialiased',
  },
})
