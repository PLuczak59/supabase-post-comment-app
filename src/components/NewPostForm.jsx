import { useState } from 'react'
import supabase from '../../utils/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import Button from './Button.jsx'
import Input from './Input.jsx'
import Textarea from './Textarea.jsx'

export default function NewPostForm({ onSuccess }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setError('')
    setSubmitting(true)
    try {
      const { error: insertError } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
      })
      if (insertError) throw insertError
      setTitle('')
      setContent('')
      showToast('Article publié')
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </p>
      )}
      <Input
        label="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Donnez un titre à votre article"
        required
      />
      <Textarea
        label="Contenu"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Rédigez votre article…"
        rows={4}
        required
      />
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={submitting}
          size="md"
        >
          {submitting ? 'Publication…' : 'Publier'}
        </Button>
      </div>
    </form>
  )
}

