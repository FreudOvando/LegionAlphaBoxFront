import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Plus, Trophy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCompetitions, useDeleteCompetition } from '@/hooks/useCompetitions'
import { CompetitionCard } from '@/components/CompetitionCard'

export function CompetitionListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [showCreateOptions, setShowCreateOptions] = useState(false)
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
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={showCreateOptions}
              onClick={() => setShowCreateOptions((open) => !open)}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400"
            >
              <Plus size={18} strokeWidth={3} />
              Nueva competencia
              <ChevronDown size={16} />
            </button>
            {showCreateOptions && (
              <div role="menu" className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
                <Link
                  role="menuitem"
                  to="/competitions/new?type=INDIVIDUAL"
                  onClick={() => setShowCreateOptions(false)}
                  className="block px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  Individual
                </Link>
                <Link
                  role="menuitem"
                  to="/competitions/new?type=TEAM"
                  onClick={() => setShowCreateOptions(false)}
                  className="block px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  En equipos
                </Link>
              </div>
            )}
          </div>
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