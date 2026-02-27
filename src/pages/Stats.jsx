import { useState, useEffect } from 'react'
import { FileText, MessageCircle, Users, BarChart2 } from 'lucide-react'
import supabase from '../../utils/supabase.js'
import Card from '../components/Card.jsx'

export default function Stats() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    avgCommentsPerPost: 0,
    avgPostsPerUser: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          supabase.from('posts').select('user_id'),
          supabase.from('comments').select('id', { count: 'exact', head: true }),
        ])

        const posts = postsRes.data ?? []
        const totalPosts = posts.length
        const totalComments = commentsRes.count ?? 0
        const distinctUsers = new Set(posts.map((p) => p.user_id)).size

        setStats({
          totalPosts,
          avgCommentsPerPost: totalPosts > 0 ? totalComments / totalPosts : 0,
          avgPostsPerUser: distinctUsers > 0 ? totalPosts / distinctUsers : 0,
        })
      } catch (err) {
        console.error(err)
        setError(err.message || 'Erreur lors du chargement des statistiques')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <p className="mt-4 text-neutral-500">Chargement des statistiques…</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </Card>
    )
  }

  const statCards = [
    {
      label: "Nombre total d'articles",
      value: stats.totalPosts,
      icon: FileText,
    },
    {
      label: 'Nombre moyen de commentaires par article',
      value: stats.avgCommentsPerPost.toFixed(2),
      icon: MessageCircle,
    },
    {
      label: "Nombre moyen d'articles par utilisateur",
      value: stats.avgPostsPerUser.toFixed(2),
      icon: Users,
    },
  ]

  return (
    <div>
      <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
        <BarChart2 className="h-8 w-8 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
        Statistiques
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              padding="lg"
              className="border-violet-200/50 bg-gradient-to-br from-white to-violet-50/30 dark:border-violet-800/30 dark:from-neutral-800 dark:to-violet-950/20"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </p>
              </div>
              <p className="text-4xl font-bold text-violet-600 dark:text-violet-400">
                {stat.value}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
