import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
