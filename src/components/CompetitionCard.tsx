import { Link } from 'react-router-dom'
import { Pencil, Trash2, Trophy } from 'lucide-react'
import type { Competition } from '@/types/competition'

interface CompetitionCardProps {
  competition: Competition
  isAdmin: boolean
  onDelete: (id: number) => void
}

export function CompetitionCard({ competition, isAdmin, onDelete }: CompetitionCardProps) {
  const formattedDate = new Date(`${competition.competitionDate}T00:00:00`).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700">
      <Link to={`/competitions/${competition.id}`} className="flex items-center gap-3">
        <Trophy className="text-red-500" size={24} />
        <div>
          <h2 className="text-lg font-bold text-zinc-50">{competition.name}</h2>
          <p className="text-sm capitalize text-zinc-500">{formattedDate}</p>
        </div>
      </Link>

      {isAdmin && (
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <Link
            to={`/competitions/${competition.id}/edit`}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Editar competencia"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={() => onDelete(competition.id)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
            aria-label="Eliminar competencia"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </article>
  )
}