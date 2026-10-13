import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCheck, Pencil, Trash2, User } from 'lucide-react'
import { WodTypeBadge } from './WodTypeBadge'
import { ScoreForm } from './ScoreForms'
import type { Wod } from '@/types/wods'

interface WodCardProps {
  wod: Wod
  onDelete: (id: number) => void
}

export function WodCard({ wod, onDelete }: WodCardProps) {
  const [showScoreForm, setShowScoreForm] = useState(false)

  const formattedDate = new Date(`${wod.publicationDate}T00:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-zinc-500">{formattedDate}</p>
          <h2 className="mt-1 text-xl font-bold text-zinc-50">{wod.name ?? 'WOD del día'}</h2>
        </div>
        <WodTypeBadge type={wod.type} />
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
        {wod.description}
      </p>

      <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
          <User size={14} />
          Coach {wod.coachName}
        </span>

        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setShowScoreForm((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-orange-400 hover:bg-red-300/10"
          >
            <ClipboardCheck size={16} />
            Registrar mi puntaje
          </button>

          <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <Link
              to={`/wods/${wod.id}/edit`}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Editar WOD"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => onDelete(wod.id)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
              aria-label="Eliminar WOD"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {showScoreForm && <ScoreForm wodId={wod.id} onClose={() => setShowScoreForm(false)} />}
    </article>
  )
}