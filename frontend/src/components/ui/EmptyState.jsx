import { SearchX } from 'lucide-react'
import Button from './Button'

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="glass-panel rounded-[24px] px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
        <SearchX className="h-8 w-8 text-slate-600" strokeWidth={1.7} />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel ? (
        <Button variant="default" className="mt-6 rounded-2xl text-white" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export default EmptyState
