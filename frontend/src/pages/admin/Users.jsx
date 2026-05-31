import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import { createUser, deleteUser, getUsers, updateUser } from '../../api/userApi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import Table from '../../components/ui/Table'
import { cn } from '../../lib/utils'

const tableColumns = [
  { key: 'user', label: 'Utilisateur' },
  { key: 'role', label: 'Fonction' },
  { key: 'team', label: 'Équipe' },
  { key: 'status', label: 'Statut' },
  { key: 'activity', label: 'Dernière activité' },
  { key: 'actions', label: 'Actions' },
]

const emptyForm = {
  name: '',
  email: '',
  role: '',
  team: '',
  status: 'active',
}

function Users() {
  const { searchValue = '', onSearchChange } = useOutletContext() ?? {}
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const stats = useMemo(() => {
    const activeCount = users.filter((user) => user.status === 'active').length
    const inactiveCount = users.length - activeCount

    return [
      { label: 'Utilisateurs visibles', value: users.length, tone: 'text-sky-300' },
      { label: 'Actifs', value: activeCount, tone: 'text-emerald-300' },
      { label: 'Inactifs', value: inactiveCount, tone: 'text-amber-300' },
    ]
  }, [users])

  const loadUsers = useCallback(
    async (page = meta.page, search = searchValue) => {
      setLoading(true)

      try {
        const response = await getUsers({
          page,
          limit: meta.limit,
          search,
        })

        setUsers(response.data)
        setMeta(response.meta)
      } finally {
        setLoading(false)
      }
    },
    [meta.limit, meta.page, searchValue],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers(1, searchValue)
  }, [loadUsers, searchValue])

  const openCreateModal = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team,
      status: user.status,
    })
    setModalOpen(true)
  }

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Supprimer ${user.name} ?`)
    if (!confirmed) {
      return
    }

    await deleteUser(user.id)
    await loadUsers(meta.page, searchValue)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (editingUser) {
      await updateUser(editingUser.id, form)
    } else {
      await createUser(form)
    }

    setModalOpen(false)
    await loadUsers(editingUser ? meta.page : 1, searchValue)
  }

  return (
    <div className="space-y-6 page-fade">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Gestion Utilisateur</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">Liste des utilisateurs</h3>
            <p className="mt-2 text-sm text-slate-600">
              Gérez les profils, les rôles et les statuts via l’API backend connectée au frontend.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={() => loadUsers(1, searchValue)}
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
              Actualiser
            </Button>
            <Button
              className="rounded-2xl bg-indigo-600 px-4 text-white hover:bg-indigo-500"
              onClick={openCreateModal}
            >
              <Plus className="h-4 w-4" strokeWidth={1.8} />
              Ajouter utilisateur
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">{meta.total}</span> utilisateur(s) trouvé(s)
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 sm:w-80">
            <Search className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
            <Input
              className="bg-transparent px-0 py-3 text-slate-900 focus:border-transparent focus:ring-0"
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Recherche rapide"
            />
          </label>
        </div>
      </section>

      {loading ? <Loader /> : null}

      {!loading && users.length === 0 ? (
        <EmptyState
          title="Aucun utilisateur ne correspond à votre recherche"
          description="Essayez un autre terme ou ajoutez un nouvel utilisateur à votre organisation."
          actionLabel="Ajouter un utilisateur"
          onAction={openCreateModal}
        />
      ) : null}

      {!loading && users.length > 0 ? (
        <Table
          columns={tableColumns}
          data={users}
          renderRow={(user) => (
            <>
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-900">
                    <span>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-slate-700">{user.role}</td>
              <td className="px-6 py-5 text-slate-600">{user.team}</td>
              <td className="px-6 py-5">
                <span
                  className={cn(
                    'inline-flex rounded-full border px-3 py-2 text-sm font-medium',
                    user.status === 'active'
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                      : 'border-amber-200 bg-amber-100 text-amber-700',
                  )}
                >
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-5 text-slate-600">{user.lastLogin}</td>
              <td className="px-6 py-5">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                    onClick={() => openEditModal(user)}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.8} />
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="rounded-xl border-red-200 bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => handleDelete(user)}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    Supprimer
                  </Button>
                </div>
              </td>
            </>
          )}
        />
      ) : null}

      <section className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Page <span className="text-slate-900">{meta.page}</span> sur <span className="text-slate-900">{meta.totalPages}</span>
        </p>

        <div className="inline-flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Button
            variant="outline"
            size="sm"
            className="rounded-l-2xl border-r-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            onClick={() => loadUsers(Math.max(1, meta.page - 1), searchValue)}
            disabled={meta.page === 1}
          >
            Précédent
          </Button>
          {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              className={cn(
                'border-r-0 border-slate-200',
                page === meta.page
                  ? 'bg-sky-100 text-slate-900 hover:bg-sky-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
              onClick={() => loadUsers(page, searchValue)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-r-2xl bg-white text-slate-700 hover:bg-slate-100"
            onClick={() => loadUsers(Math.min(meta.totalPages, meta.page + 1), searchValue)}
            disabled={meta.page === meta.totalPages}
          >
            Suivant
          </Button>
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        title={editingUser ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
        description="Les modifications sont envoyées au backend et reflètent les données réelles de l’API."
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitLabel={editingUser ? 'Enregistrer' : 'Créer'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="w-full">
            <p className="mb-2 text-sm text-slate-600">Nom complet</p>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>
          <div className="w-full">
            <p className="mb-2 text-sm text-slate-600">Email</p>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
          <div className="w-full">
            <p className="mb-2 text-sm text-slate-600">Rôle</p>
            <Input
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              required
            />
          </div>
          <div className="w-full">
            <p className="mb-2 text-sm text-slate-600">Équipe</p>
            <Input
              value={form.team}
              onChange={(event) => setForm((current) => ({ ...current, team: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-sm text-slate-600">Statut</p>
            <Select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Users
