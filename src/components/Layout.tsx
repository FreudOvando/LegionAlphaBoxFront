import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { MembershipBadge } from '@/components/MembershipBadge'
import { CalendarDays, CreditCard, House, LogOut, Plus, Trophy, UserRound } from 'lucide-react'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-2xl font-black tracking-tight">
            Workout<span className="text-red-500">Me-C</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/wods/new"
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
                  >
                    <Plus size={18} strokeWidth={3} />
                    Nuevo WOD
                  </Link>
                )}

                <MembershipBadge />

                <span className="text-sm text-zinc-400">
                  Hola, <span className="font-semibold text-zinc-200">{user.firstName}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                  aria-label="Cerrar sesión"
                  type="button"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-zinc-400 hover:text-zinc-100">
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-red-300"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-2" aria-label="Navegación principal">
            {[
              { to: '/', label: 'Principal', icon: House, end: true },
              { to: '/history', label: 'Historial', icon: CalendarDays },
              { to: '/competitions', label: 'Competencias', icon: Trophy },
              { to: '/billing', label: 'Facturación', icon: CreditCard },
              { to: '/profile', label: 'Mi perfil', icon: UserRound },
            ].map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm transition ${isActive ? 'border-orange-500 text-orange-400' : 'border-transparent text-zinc-500 hover:text-zinc-200'}`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}