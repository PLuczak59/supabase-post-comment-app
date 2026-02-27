import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from './Button.jsx'

export default function AppHeader() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMenuOpen(false)
  }

  const navLink =
    'rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-violet-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-violet-400'

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-violet-600 no-underline transition-colors hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Posts & Commentaires
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className={navLink}>
            Accueil
          </Link>
          <Link to="/stats" className={navLink}>
            Statistiques
          </Link>

          <div className="relative ml-2">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-sm font-semibold text-white shadow-md shadow-violet-600/40 hover:shadow-lg hover:shadow-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950"
              aria-label="Menu utilisateur"
            >
              {user
                ? (user.email || '?').charAt(0).toUpperCase()
                : '⋮'}
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white/95 p-2 text-sm shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">
                {loading ? (
                  <div className="px-3 py-2 text-neutral-500 dark:text-neutral-400">
                    Chargement…
                  </div>
                ) : user ? (
                  <>
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800">
                      <div className="flex flex-col">
                        <span className="max-w-[160px] truncate text-xs font-medium text-neutral-700 dark:text-neutral-200">
                          {user.email}
                        </span>
                        {isAdmin && (
                          <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/')
                        setMenuOpen(false)
                      }}
                      className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <span>Accueil</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <span>Se déconnecter</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/login')
                        setMenuOpen(false)
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <span>Connexion</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/register')
                        setMenuOpen(false)
                      }}
                      className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <span>Inscription</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
