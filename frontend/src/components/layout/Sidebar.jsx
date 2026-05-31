import { NavLink } from 'react-router-dom'
import { LayoutDashboard, LogOut, Settings, Users } from 'lucide-react'

const navigationItems = [
  {
    label: 'Dashboard',
    description: 'Vue globale',
    path: '/admin/dashboard', // Assure-toi que ce chemin est différent de la gestion utilisateur !
    icon: LayoutDashboard,
  },
  {
    label: 'Gestion Utilisateur',
    description: 'Comptes et accès',
    path: '/admin/users',
    icon: Users,
  },
  {
    label: 'Paramètres',
    description: 'Préférences',
    path: '/admin/settings',
    icon: Settings,
  },
]

function Sidebar() {
  return (
    // CORRECTION : Ajout de "flex-col" pour aligner verticalement l'en-tête et la navigation
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[260px] flex-col border-r border-slate-200/80 bg-white/95 px-0 py-6 backdrop-blur-xl xl:flex">
      
      {/* En-tête : Logo & Titre */}
      <div className="px-6 pb-6">
        <div className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-base font-bold text-slate-900">
            C
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Corpium</p>
            <h1 className="text-lg font-semibold text-slate-900">Admin</h1>
          </div>
        </div>
      </div>

      {/* Liens de navigation et bouton Déconnexion */}
      <div className="flex flex-1 flex-col justify-between px-4 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                [
                  'group flex min-w-0 items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200',
                  isActive
                    ? 'bg-sky-50 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <item.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{item.label}</p>
                <p className="truncate text-xs text-slate-500">{item.description}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Bouton de déconnexion */}
        <button className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
          <LogOut className="h-5 w-5" strokeWidth={1.8} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar