import Button from './Button'

function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  onSubmit,
  submitLabel = 'Enregistrer',
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>

        <form onSubmit={onSubmit}>
          <div className="px-6 py-5">{children}</div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="text-slate-700" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
