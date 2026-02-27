import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../../utils/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Modal from '../components/Modal.jsx'
import NewPostForm from '../components/NewPostForm.jsx'

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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <p className="mt-4 text-neutral-500">Chargement des articles…</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
        Articles
      </h1>

      <section>
        {posts.length === 0 ? (
          <Card className="text-center">
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
                  <h3 className="mb-2 text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                    {post.title}
                  </h3>
                  <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
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
            className="fixed bottom-6 right-6 z-30 shadow-lg shadow-violet-600/30"
            onClick={() => setNewPostOpen(true)}
          >
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

