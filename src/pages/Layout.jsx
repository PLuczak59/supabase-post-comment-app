import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'
import AppFooter from '../components/AppFooter.jsx'

const BASE_TITLE = 'Posts & Commentaires'

const routeTitles = {
  '/': 'Articles',
  '/login': 'Connexion',
  '/register': 'Inscription',
  '/stats': 'Statistiques',
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/post/')) return 'Article'
  const title = routeTitles[pathname] ?? 'Articles'
  return `${title} — ${BASE_TITLE}`
}

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
