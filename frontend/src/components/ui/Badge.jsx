import { cn } from '../../lib/utils'

const variants = {
  default: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-100 text-emerald-700',
  warning: 'border-amber-200 bg-amber-100 text-amber-700',
}

function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
