import { cn } from '../../lib/utils'

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-2',
}

function Spinner({ className, size = 'md' }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-slate-300 border-t-sky-600',
        sizes[size],
        className,
      )}
    />
  )
}

export default Spinner
