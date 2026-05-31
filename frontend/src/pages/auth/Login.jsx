import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { loginUser } from '../../api/userApi'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'

const initialErrors = {
  email: '',
  password: '',
}

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: 'admin@corpium.app',
    password: 'Admin123!',
  })
  const [errors, setErrors] = useState(initialErrors)

  const validate = () => {
    const nextErrors = {
      email: '',
      password: '',
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Veuillez saisir votre email.'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Format d’email invalide.'
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Veuillez saisir votre mot de passe.'
    } else if (form.password.length < 6) {
      nextErrors.password = 'Minimum 6 caractères.'
    }

    setErrors(nextErrors)
    return !nextErrors.email && !nextErrors.password
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const response = await loginUser({ ...form, rememberMe })
      window.localStorage.setItem('auth_token', response.token)
      window.localStorage.setItem('auth_user', JSON.stringify(response.user))
      navigate('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: '',
      }))
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Cercles décoratifs d'arrière-plan (Glow effects) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-sky-400/15 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-blue-400/15 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 font-bold text-white shadow-lg shadow-sky-500/20 text-xl">
            C
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Bienvenue
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous à l'espace d'administration Corpium
          </p>
        </div>

        {/* Card Formulaire */}
        <div className="mt-8 rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-100 backdrop-blur-md sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Champ Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Identifiant Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nom@corpium.app"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`pl-10 rounded-xl bg-slate-50/50 focus:bg-white transition-all ${
                    errors.email ? 'border-red-400 focus:ring-red-100' : 'focus:ring-sky-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Mot de passe
                </label>
                <button 
                  type="button" 
                  className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline transition"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <LockKeyhole className="h-4 w-4" strokeWidth={2} />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`pl-10 pr-10 rounded-xl bg-slate-50/50 focus:bg-white transition-all ${
                    errors.password ? 'border-red-400 focus:ring-red-100' : 'focus:ring-sky-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1 pl-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Options */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  label="Se souvenir de moi"
                  className="rounded-md border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Bouton de Soumission */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full justify-center gap-2 rounded-xl bg-sky-500 py-2.5 font-semibold text-white shadow-md shadow-sky-500/10 hover:bg-sky-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4 text-white" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </div>
          </form>

          {/* Footer d'invitation */}
          <p className="mt-8 text-center text-xs text-slate-400">
            Besoin d’un accès ?{' '}
            <a href="#" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition">
              Demander l’accès administrateur
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login