import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Checkbox = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border-slate-300 text-sky-600 transition duration-200 focus:ring-2 focus:ring-sky-400/60',
        className,
      )}
      {...props}
    />
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
