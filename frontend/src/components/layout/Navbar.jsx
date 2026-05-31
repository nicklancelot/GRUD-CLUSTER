import { Bell, Menu, Search } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

function Navbar({ title, searchValue, onSearchChange }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="xl:hidden border border-slate-200 bg-slate-100 text-slate-700">
            <Menu className="h-4 w-4" strokeWidth={1.8} />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Espace administration</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-4 text-slate-700 sm:w-80">
            <Search className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
            <Input
              className="bg-transparent px-0 py-3 text-slate-900 focus:border-transparent focus:ring-0"
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Rechercher un utilisateur..."
            />
          </label>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Bell className="h-5 w-5" strokeWidth={1.8} />
            </Button>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sm font-semibold text-slate-900">
                <span>AC</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin Corpium</p>
                <p className="text-xs text-slate-500">Super Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
