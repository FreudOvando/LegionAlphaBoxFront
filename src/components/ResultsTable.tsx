import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { useDeleteEnrollment, useSaveResult } from '@/hooks/useCompetitionDetail'
import type { CompetitionEnrollment, CompetitionResult, CompetitionStage } from '@/types/competition'

interface ResultsTableProps {
  competitionId: number
  stages: CompetitionStage[]
  enrollments: CompetitionEnrollment[]
  results: CompetitionResult[]
  isAdmin: boolean
}

export function ResultsTable({ competitionId, stages, enrollments, results, isAdmin }: ResultsTableProps) {
  const saveResult = useSaveResult(competitionId)
  const deleteEnrollment = useDeleteEnrollment(competitionId)
  const [editingCell, setEditingCell] = useState<{ stageId: number; enrollmentId: number } | null>(null)
  const [draftValue, setDraftValue] = useState('')

  if (enrollments.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no hay atletas inscritos.</p>
  }
  if (stages.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no hay WODs agregados a esta competencia.</p>
  }

  const rows = enrollments
    .map((enrollment) => {
      const byStage = new Map(
        results.filter((r) => r.enrollmentId === enrollment.id).map((r) => [r.stageId, r.percentage]),
      )
      const total = [...byStage.values()].reduce((sum, value) => sum + value, 0)
      return { enrollment, byStage, total }
    })
    .sort((a, b) => b.total - a.total)

  function startEdit(stageId: number, enrollmentId: number, current: number | undefined) {
    setEditingCell({ stageId, enrollmentId })
    setDraftValue(current?.toString() ?? '')
  }

  function cancelEdit() {
    setEditingCell(null)
    setDraftValue('')
  }

  function confirmEdit() {
    if (!editingCell) return
    const percentage = Number(draftValue)
    if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) return
    saveResult.mutate(
      { stageId: editingCell.stageId, enrollmentId: editingCell.enrollmentId, percentage },
      { onSuccess: cancelEdit },
    )
  }

  function handleDeleteEnrollment(enrollmentId: number, name: string) {
    if (confirm(`¿Eliminar a ${name} de esta competencia? También se borrarán sus resultados.`)) {
      deleteEnrollment.mutate(enrollmentId)
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Atleta</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            {stages.map((stage) => (
              <th key={stage.id} className="px-4 py-3 text-center font-medium">{stage.name}</th>
            ))}
            <th className="px-4 py-3 text-center font-medium">Total</th>
            {isAdmin && <th className="px-4 py-3 text-center font-medium">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ enrollment, byStage, total }, index) => (
            <tr key={enrollment.id} className="border-b border-zinc-800 last:border-0">
              <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-zinc-100">{enrollment.userFullName}</td>
              <td className="px-4 py-3 text-zinc-400">{enrollment.category}</td>
              {stages.map((stage) => {
                const isEditing = editingCell?.stageId === stage.id && editingCell?.enrollmentId === enrollment.id
                const value = byStage.get(stage.id)

                return (
                  <td key={stage.id} className="px-4 py-3 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          autoFocus
                          type="number"
                          min={0}
                          max={100}
                          value={draftValue}
                          onChange={(e) => setDraftValue(e.target.value)}
                          className="w-16 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-center text-zinc-100"
                        />
                        <button onClick={confirmEdit} className="text-emerald-400 hover:text-emerald-300" aria-label="Guardar">
                          <Check size={14} />
                        </button>
                        <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300" aria-label="Cancelar">
                          <X size={14} />
                        </button>
                      </div>
                    ) : isAdmin ? (
                      <button
                        onClick={() => startEdit(stage.id, enrollment.id, value)}
                        className="group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400"
                      >
                        {value ?? '—'}
                        <Pencil size={12} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    ) : (
                      <span className="text-zinc-300">{value ?? '—'}</span>
                    )}
                  </td>
                )
              })}
              <td className="px-4 py-3 text-center font-bold text-orange-400">{total}</td>
              {isAdmin && (
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteEnrollment(enrollment.id, enrollment.userFullName)}
                    className="text-zinc-500 hover:text-red-400"
                    aria-label={`Eliminar a ${enrollment.userFullName}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}