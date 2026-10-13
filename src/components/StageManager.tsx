import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useCreateStage, useDeleteStage, useStages } from '@/hooks/useCompetitionDetail'

const inputStyles =
  'rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'

export function StageManager({ competitionId }: { competitionId: number }) {
  const { data: stages } = useStages(competitionId)
  const createStage = useCreateStage(competitionId)
  const deleteStage = useDeleteStage(competitionId)
  const [name, setName] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const nextOrder = (stages?.length ?? 0) + 1
    createStage.mutate({ name: name.trim(), stageOrder: nextOrder }, { onSuccess: () => setName('') })
  }

  function handleDelete(stageId: number) {
    if (confirm('¿Eliminar este WOD de la competencia? Se borrarán también sus resultados.')) {
      deleteStage.mutate(stageId)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">WODs de la competencia</h2>

      <ul className="mb-4 flex flex-wrap gap-2">
        {stages?.map((stage) => (
          <li key={stage.id} className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200">
            {stage.name}
            <button onClick={() => handleDelete(stage.id)} className="text-zinc-500 hover:text-red-400" aria-label={`Eliminar ${stage.name}`}>
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. WOD 1"
          className={`${inputStyles} flex-1`}
        />
        <button
          type="submit"
          disabled={createStage.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60"
        >
          <Plus size={16} />
          Agregar
        </button>
      </form>
    </div>
  )
}