import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-sky-600 text-white hover:bg-sky-700',
  outline: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  info: 'bg-slate-100 text-slate-950 hover:bg-slate-200',
  danger: 'bg-red-100 text-red-700 hover:bg-red-200',
}

const sizes = {
  default: 'h-14 px-6 text-base',
  sm: 'h-10 px-4 text-sm',
  icon: 'h-10 w-10 rounded-full p-0',
  full: 'w-full',
}

const Button = forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export default Button
