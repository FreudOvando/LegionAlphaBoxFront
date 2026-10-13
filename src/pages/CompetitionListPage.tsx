import { Link } from 'react-router-dom'
import { Plus, Trophy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCompetitions, useDeleteCompetition } from '@/hooks/useCompetitions'
import { CompetitionCard } from '@/components/CompetitionCard'

export function CompetitionListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const { data: competitions, isLoading, isError } = useCompetitions()
  const deleteCompetition = useDeleteCompetition()

  function handleDelete(id: number) {
    if (confirm('¿Eliminar esta competencia? Esta acción no se puede deshacer.')) {
      deleteCompetition.mutate(id)
    }
  }

  if (isLoading) {
    return <p className="text-center text-zinc-500">Cargando competencias…</p>
  }

  if (isError) {
    return <p className="text-center text-red-400">No se pudo conectar con el servidor.</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-50">Competencias</h1>
        {isAdmin && (
          <Link
            to="/competitions/new"
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
          >
            <Plus size={18} strokeWidth={3} />
            Nueva competencia
          </Link>
        )}
      </div>

      {!competitions || competitions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Trophy className="text-zinc-700" size={48} />
          <p className="text-zinc-500">Todavía no hay competencias creadas.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}