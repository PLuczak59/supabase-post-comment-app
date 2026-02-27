import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import supabase from '../../utils/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import FormCard from '../components/FormCard.jsx'
import Textarea from '../components/Textarea.jsx'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at, user_id')
        .eq('id', id)
        .single()
      if (error || !data) {
        setPost(null)
        setLoading(false)
        return
      }
      setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [id])

  useEffect(() => {
    if (!id) return
    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id')
        .eq('post_id', id)
        .order('created_at', { ascending: true })
      if (error) {
        console.error('Erreur chargement commentaires:', error)
        setComments([])
      } else {
        setComments(data ?? [])
      }
    }
    fetchComments()
  }, [id])

  useEffect(() => {
    if (!id) return
    const channel = supabase
      .channel(`comments-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setComments((prev) =>
              prev.map((c) => (c.id === payload.new.id ? payload.new : c))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const { error } = await supabase.from('comments').insert({
        post_id: id,
        content: commentContent.trim(),
        user_id: user.id,
      })
      if (error) throw error
      setCommentContent('')
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de l\'envoi du commentaire')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!isAdmin || !post) return
    if (!window.confirm('Supprimer cet article et tous ses commentaires ?')) return
    setDeleting('post')
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error
      navigate('/')
    } catch (err) {
      console.error(err)
      setDeleting(null)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!isAdmin) return
    if (!window.confirm('Supprimer ce commentaire ?')) return
    setDeleteError(null)
    setDeleting(commentId)
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId)
      if (error) throw error
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error(err)
      setDeleteError(err.message || 'Impossible de supprimer le commentaire')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <p className="mt-4 text-neutral-500">Chargement…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <Card className="text-center">
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">Article introuvable.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </Card>
    )
  }

  return (
    <article>
      <Card padding="lg" className="mb-8">
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
            {post.title}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(post.created_at).toLocaleString('fr-FR', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
          {isAdmin && (
            <div className="mt-4">
              <Button
                variant="dangerGhost"
                size="sm"
                onClick={handleDeletePost}
                disabled={deleting === 'post'}
              >
                {deleting === 'post' ? 'Suppression…' : "Supprimer l'article"}
              </Button>
            </div>
          )}
        </header>
        <div className="whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
          {post.content}
        </div>
      </Card>

      <section className="border-t border-neutral-200 pt-8 dark:border-neutral-700">
        {deleteError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {deleteError}
          </p>
        )}
        <h2 className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          Commentaires
          <span className="ml-2 rounded-full bg-violet-100 px-2.5 py-0.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
            {comments.length}
          </span>
        </h2>

        {user && (
          <FormCard title="Écrire un commentaire" className="mb-8">
            <form className="flex flex-col gap-4" onSubmit={handleAddComment}>
              {submitError && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                  {submitError}
                </p>
              )}
              <Textarea
                label="Votre message"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Partagez votre avis…"
                rows={3}
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Envoi…' : 'Publier le commentaire'}
              </Button>
            </form>
          </FormCard>
        )}

        <ul className="list-none space-y-4 p-0">
          {comments.map((comment) => (
            <li key={comment.id} className="relative">
              <Card padding="default" className="pr-24">
                <p className="mb-2 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                  {comment.content}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(comment.created_at).toLocaleString('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                {isAdmin && (
                  <div className="absolute right-4 top-4">
                    <Button
                      variant="dangerGhost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deleting === comment.id}
                    >
                      {deleting === comment.id ? '…' : 'Supprimer'}
                    </Button>
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
        {comments.length === 0 && (
          <Card className="text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              Aucun commentaire pour le moment.
              {!user && ' Connectez-vous pour réagir.'}
            </p>
          </Card>
        )}
      </section>
    </article>
  )
}
