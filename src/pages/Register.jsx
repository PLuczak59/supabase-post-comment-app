import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setConfirmError('')
    setLoading(true)
    setSuccess(false)
    if (password !== confirmPassword) {
      setLoading(false)
      setConfirmError('Les mots de passe ne correspondent pas.')
      return
    }
    try {
      await signUp(email, password)
      setSuccess(true)
      navigate('/')
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card padding="lg" className="shadow-lg">
        <h1 className="mb-8 flex items-center justify-center gap-2 text-center text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
          <UserPlus className="h-7 w-7 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
          Inscription
        </h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              Compte créé. Vous pouvez vous connecter.
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
            minLength={6}
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={confirmError}
          />
          <Button type="submit" disabled={loading} size="lg" className="flex w-full items-center justify-center gap-2">
            <UserPlus className="h-5 w-5 shrink-0" aria-hidden />
            {loading ? 'Inscription…' : "S'inscrire"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  )
}
