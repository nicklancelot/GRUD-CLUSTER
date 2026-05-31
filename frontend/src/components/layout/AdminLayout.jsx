import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function AdminLayout({ searchValue, onSearchChange, title = 'Gestion Utilisateur' }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="ml-0 xl:ml-[260px]">
        <div className="flex min-h-screen flex-col">
          <Navbar title={title} searchValue={searchValue} onSearchChange={onSearchChange} />

          <main className="flex-1 px-4 py-6 sm:px-6 xl:px-8">
            <Outlet context={{ searchValue, onSearchChange }} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
