import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Login from '../pages/auth/Login'
import Users from '../pages/admin/Users'

function PlaceholderSettings() {
  return (
    <div className="glass-panel page-fade rounded-[30px] p-8 bg-white">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Paramètres</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900">Section statique</h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Cette vue reste volontairement statique dans ce projet frontend. Vous pouvez y brancher d’autres modules plus
        tard sans modifier la structure globale.
      </p>
    </div>
  )
}

function AppRoutes() {
  const [adminSearch, setAdminSearch] = useState('')

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <AdminLayout
            title="Pilotage des utilisateurs"
            searchValue={adminSearch}
            onSearchChange={setAdminSearch}
          />
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<PlaceholderSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
