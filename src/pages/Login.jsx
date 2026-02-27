import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card padding="lg" className="shadow-lg">
        <h1 className="mb-8 flex items-center justify-center gap-2 text-center text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
          <LogIn className="h-7 w-7 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
          Connexion
        </h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <PasswordInput
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" disabled={loading} size="lg" className="flex w-full items-center justify-center gap-2">
            <LogIn className="h-5 w-5 shrink-0" aria-hidden />
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            S'inscrire
          </Link>
        </p>
      </Card>
    </div>
  )
}
