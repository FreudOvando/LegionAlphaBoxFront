import { Fragment, useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import {
  useDeleteEnrollment,
  useDeletePerformance,
  useDeleteTeamPerformance,
  usePerformances,
  useSavePerformance,
  useSaveResult,
  useSaveTeamPerformance,
  useSaveTeamPercentage,
  useTeamResults,
} from '@/hooks/useCompetitionDetail'
import type {
  CompetitionEnrollment,
  CompetitionResult,
  CompetitionStage,
  CompetitionTeam,
} from '@/types/competition'

interface ResultsTableProps {
  competitionId: number
  stages: CompetitionStage[]
  enrollments: CompetitionEnrollment[]
  results: CompetitionResult[]
  isAdmin: boolean
  teams?: CompetitionTeam[]
}

interface ScoreRow {
  id: number
  label: string
  category: string
  total: number
  percentages: Map<number, number>
  performanceValues: Map<number, string>
  performanceIds: Map<number, number>
}

interface EditingCell {
  stageId: number
  rowId: number
}

export function ResultsTable({
  competitionId,
  stages,
  enrollments,
  results,
  isAdmin,
  teams,
}: ResultsTableProps) {
  const isTeamCompetition = teams !== undefined
  const { data: performances, isError: performanceError } = usePerformances(competitionId, !isTeamCompetition)
  const { data: teamResults, isError: teamResultError } = useTeamResults(competitionId, isTeamCompetition)
  const saveResult = useSaveResult(competitionId)
  const savePerformance = useSavePerformance(competitionId)
  const deletePerformance = useDeletePerformance(competitionId)
  const saveTeamPercentage = useSaveTeamPercentage(competitionId)
  const saveTeamPerformance = useSaveTeamPerformance(competitionId)
  const deleteTeamPerformance = useDeleteTeamPerformance(competitionId)
  const deleteEnrollment = useDeleteEnrollment(competitionId)
  const [editingPercentage, setEditingPercentage] = useState<EditingCell | null>(null)
  const [editingPerformance, setEditingPerformance] = useState<EditingCell | null>(null)
  const [draftValue, setDraftValue] = useState('')

  const rows: ScoreRow[] = isTeamCompetition
    ? (teams ?? []).map((team) => {
        const byStage = (teamResults ?? []).filter((result) => result.teamId === team.id)
        const percentages = new Map(
          byStage.flatMap((result) => result.percentage === null ? [] : [[result.stageId, result.percentage] as const]),
        )
        const performanceValues = new Map(
          byStage.flatMap((result) => result.repsOrTime === null ? [] : [[result.stageId, result.repsOrTime] as const]),
        )
        const teamResultIds = new Map(byStage.map((result) => [result.stageId, result.id] as const))
        return {
          id: team.id,
          label: team.name,
          category: 'Equipo',
          total: [...percentages.values()].reduce((sum, value) => sum + value, 0),
          percentages,
          performanceValues,
          performanceIds: teamResultIds,
        }
      })
    : enrollments.map((enrollment) => {
        const enrollmentResults = results.filter((result) => result.enrollmentId === enrollment.id)
        const enrollmentPerformances = (performances ?? []).filter(
          (performance) => performance.enrollmentId === enrollment.id,
        )
        const percentages = new Map(enrollmentResults.map((result) => [result.stageId, result.percentage] as const))
        return {
          id: enrollment.id,
          label: enrollment.userFullName,
          category: enrollment.category,
          total: [...percentages.values()].reduce((sum, value) => sum + value, 0),
          percentages,
          performanceValues: new Map(
            enrollmentPerformances.map((performance) => [performance.stageId, performance.repsOrTime] as const),
          ),
          performanceIds: new Map(
            enrollmentPerformances.map((performance) => [performance.stageId, performance.id] as const),
          ),
        }
      })

  rows.sort((a, b) => b.total - a.total)

  function startPercentageEdit(stageId: number, row: ScoreRow) {
    setEditingPercentage({ stageId, rowId: row.id })
    setEditingPerformance(null)
    setDraftValue(row.percentages.get(stageId)?.toString() ?? '')
  }

  function startPerformanceEdit(stageId: number, row: ScoreRow) {
    setEditingPerformance({ stageId, rowId: row.id })
    setEditingPercentage(null)
    setDraftValue(row.performanceValues.get(stageId) ?? '')
  }

  function cancelEdit() {
    setEditingPercentage(null)
    setEditingPerformance(null)
    setDraftValue('')
  }

  function confirmPercentageEdit(row: ScoreRow) {
    if (!editingPercentage) return
    const percentage = Number(draftValue)
    if (draftValue === '' || !Number.isInteger(percentage) || percentage < 0 || percentage > 100) return

    if (isTeamCompetition) {
      saveTeamPercentage.mutate(
        { stageId: editingPercentage.stageId, teamId: row.id, percentage },
        { onSuccess: cancelEdit },
      )
    } else {
      saveResult.mutate(
        { stageId: editingPercentage.stageId, enrollmentId: row.id, percentage },
        { onSuccess: cancelEdit },
      )
    }
  }

  function confirmPerformanceEdit(row: ScoreRow) {
    if (!editingPerformance || !/^[\p{L}\p{N} .:;]{1,20}$/u.test(draftValue)) return

    if (isTeamCompetition) {
      saveTeamPerformance.mutate(
        { stageId: editingPerformance.stageId, teamId: row.id, repsOrTime: draftValue },
        { onSuccess: cancelEdit },
      )
    } else {
      savePerformance.mutate(
        { stageId: editingPerformance.stageId, enrollmentId: row.id, repsOrTime: draftValue },
        { onSuccess: cancelEdit },
      )
    }
  }

  function handleDeletePerformance(stageId: number, row: ScoreRow) {
    const resultId = row.performanceIds.get(stageId)
    if (resultId === undefined || !confirm('¿Eliminar el valor de reps o tiempo?')) return
    if (isTeamCompetition) {
      deleteTeamPerformance.mutate(resultId)
    } else {
      deletePerformance.mutate(resultId)
    }
  }

  function handleDeleteEnrollment(enrollmentId: number, name: string) {
    if (confirm(`¿Eliminar a ${name} de esta competencia? También se borrarán sus resultados.`)) {
      deleteEnrollment.mutate(enrollmentId)
    }
  }

  const isSaving = saveResult.isPending
    || savePerformance.isPending
    || saveTeamPercentage.isPending
    || saveTeamPerformance.isPending

  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        {isTeamCompetition ? 'Todavía no hay equipos creados.' : 'Todavía no hay atletas inscritos.'}
      </p>
    )
  }
  if (stages.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no hay WODs agregados a esta competencia.</p>
  }
  if (performanceError || teamResultError) {
    return <p role="alert" className="text-sm text-red-400">No se pudieron cargar los puntajes y resultados.</p>
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[780px] text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400">
            <th rowSpan={2} className="px-4 py-3 font-medium">#</th>
            <th rowSpan={2} className="px-4 py-3 font-medium">{isTeamCompetition ? 'Equipo' : 'Atleta'}</th>
            <th rowSpan={2} className="px-4 py-3 font-medium">Categoría</th>
            {stages.map((stage) => (
              <th key={stage.id} colSpan={2} className="px-4 py-3 text-center font-medium">{stage.name}</th>
            ))}
            <th rowSpan={2} className="px-4 py-3 text-center font-medium">Total</th>
            {isAdmin && !isTeamCompetition && (
              <th rowSpan={2} className="px-4 py-3 text-center font-medium">Acciones</th>
            )}
          </tr>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-500">
            {stages.map((stage) => (
              <Fragment key={stage.id}>
                <th className="px-3 py-2 text-center text-xs font-medium">Puntaje %</th>
                <th className="px-3 py-2 text-center text-xs font-medium">Reps / tiempo</th>
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-b border-zinc-800 last:border-0">
              <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-zinc-100">{row.label}</td>
              <td className="px-4 py-3 text-zinc-400">{row.category}</td>
              {stages.map((stage) => {
                const isEditingScore =
                  editingPercentage?.stageId === stage.id && editingPercentage.rowId === row.id
                const isEditingPerformanceCell =
                  editingPerformance?.stageId === stage.id && editingPerformance.rowId === row.id
                const percentage = row.percentages.get(stage.id)
                const performanceValue = row.performanceValues.get(stage.id)

                return (
                  <Fragment key={stage.id}>
                    <td className="px-3 py-3 text-center">
                      {isEditingScore ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={draftValue}
                            onChange={(event) => setDraftValue(event.target.value)}
                            className="w-16 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-center text-zinc-100"
                            aria-label={`Puntaje porcentual de ${row.label}, ${stage.name}`}
                          />
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => confirmPercentageEdit(row)}
                            className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                            aria-label="Guardar puntaje porcentual"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-zinc-500 hover:text-zinc-300"
                            aria-label="Cancelar edición"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : isAdmin ? (
                        <button
                          type="button"
                          onClick={() => startPercentageEdit(stage.id, row)}
                          className="group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400"
                          aria-label={`Editar puntaje porcentual de ${row.label}, ${stage.name}`}
                        >
                          {percentage ?? '—'}
                          <Pencil size={12} className="opacity-0 group-hover:opacity-100" />
                        </button>
                      ) : (
                        <span className="text-zinc-300">{percentage ?? '—'}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {isEditingPerformanceCell ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            autoFocus
                            type="text"
                            inputMode="text"
                            pattern="[\p{L}\p{N} .:;]{1,20}"
                            maxLength={20}
                            value={draftValue}
                            onChange={(event) =>
                              setDraftValue(event.target.value.replace(/[^\p{L}\p{N} .:;]/gu, '').slice(0, 20))
                            }
                            className="w-24 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-center text-zinc-100"
                            aria-label={`Reps o tiempo de ${row.label}, ${stage.name}`}
                            title="Usa hasta 20 caracteres: letras, números, espacios, punto, dos puntos y punto y coma"
                          />
                          <button
                            type="button"
                            disabled={isSaving || !/^[\p{L}\p{N} .:;]{1,20}$/u.test(draftValue)}
                            onClick={() => confirmPerformanceEdit(row)}
                            className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                            aria-label="Guardar reps o tiempo"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-zinc-500 hover:text-zinc-300"
                            aria-label="Cancelar edición"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : isAdmin ? (
                        <div className="inline-flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => startPerformanceEdit(stage.id, row)}
                            className="group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400"
                            aria-label={`Editar reps o tiempo de ${row.label}, ${stage.name}`}
                          >
                            {performanceValue ?? '—'}
                            <Pencil size={12} className="opacity-0 group-hover:opacity-100" />
                          </button>
                          {performanceValue !== undefined && (
                            <button
                              type="button"
                              onClick={() => handleDeletePerformance(stage.id, row)}
                              disabled={deletePerformance.isPending || deleteTeamPerformance.isPending}
                              className="text-zinc-600 hover:text-red-400 disabled:opacity-50"
                              aria-label={`Eliminar reps o tiempo de ${row.label}, ${stage.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-300">{performanceValue ?? '—'}</span>
                      )}
                    </td>
                  </Fragment>
                )
              })}
              <td className="px-4 py-3 text-center font-bold text-orange-400">{row.total}</td>
              {isAdmin && !isTeamCompetition && (
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteEnrollment(row.id, row.label)}
                    className="text-zinc-500 hover:text-red-400"
                    aria-label={`Eliminar a ${row.label}`}
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
