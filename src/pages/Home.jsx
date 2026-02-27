import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calendar, PenSquare, Sparkles } from 'lucide-react'
import supabase from '../../utils/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Modal from '../components/Modal.jsx'
import NewPostForm from '../components/NewPostForm.jsx'
import PostCardSkeleton from '../components/PostCardSkeleton.jsx'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

function isNew(createdAt) {
  return Date.now() - new Date(createdAt).getTime() < ONE_DAY_MS
}

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPostOpen, setNewPostOpen] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at, user_id')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Erreur chargement posts:', error)
        setPosts([])
      } else {
        setPosts(data ?? [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="relative">
        <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
          <FileText className="h-8 w-8 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
          Articles
        </h1>
        <ul className="list-none space-y-5 p-0">
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="relative">
      <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
        <FileText className="h-8 w-8 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
        Articles
      </h1>

      <section>
        {posts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-3 h-12 w-12 text-neutral-300 dark:text-neutral-600" aria-hidden />
            <p className="text-neutral-500">Aucun article pour le moment.</p>
            <p className="mt-1 text-sm text-neutral-400">
              Connectez-vous pour publier le premier.
            </p>
          </Card>
        ) : (
          <ul className="list-none space-y-5 p-0">
            {posts.map((post) => (
              <li key={post.id}>
                <Card
                  as={Link}
                  to={`/post/${post.id}`}
                  hover
                  padding="lg"
                  className="block no-underline transition-all hover:border-violet-200 dark:hover:border-violet-800/50"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                      {post.title}
                    </h3>
                    {isNew(post.created_at) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                        <Sparkles className="h-3 w-3" aria-hidden />
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="mb-3 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                    <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {new Date(post.created_at).toLocaleString('fr-FR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p className="line-clamp-2 text-neutral-600 dark:text-neutral-300">
                    {post.content?.slice(0, 200)}
                    {post.content?.length > 200 ? '…' : ''}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {user && (
        <>
          <Button
            variant="primary"
            size="lg"
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 shadow-lg shadow-violet-600/30"
            onClick={() => setNewPostOpen(true)}
          >
            <PenSquare className="h-5 w-5 shrink-0" aria-hidden />
            Créer un article
          </Button>
          <Modal
            open={newPostOpen}
            title="Nouvel article"
            onClose={() => setNewPostOpen(false)}
          >
            <NewPostForm onSuccess={() => setNewPostOpen(false)} />
          </Modal>
        </>
      )}
    </div>
  )
}

