import { useState } from 'react'
import { Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react'
import {
  useCompetitionTeams,
  useCreateCompetitionTeam,
  useDeleteCompetitionTeam,
  useUpdateCompetitionTeam,
} from '@/hooks/useCompetitions'
import { useStages, useTeamResults } from '@/hooks/useCompetitionDetail'
import { ResultsTable } from '@/components/ResultsTable'
import type { CompetitionEnrollment, CompetitionTeam } from '@/types/competition'

interface TeamManagerProps {
  competitionId: number
  enrollments: CompetitionEnrollment[]
  isAdmin: boolean
}

const inputStyles =
  'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'

export function TeamManager({ competitionId, enrollments, isAdmin }: TeamManagerProps) {
  const { data: teams, isLoading, isError } = useCompetitionTeams(competitionId)
  const { data: stages, isLoading: loadingStages } = useStages(competitionId)
  const { isLoading: loadingResults } = useTeamResults(competitionId)
  const createTeam = useCreateCompetitionTeam(competitionId)
  const updateTeam = useUpdateCompetitionTeam(competitionId)
  const deleteTeam = useDeleteCompetitionTeam(competitionId)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTeam, setEditingTeam] = useState<CompetitionTeam | null>(null)
  const [name, setName] = useState('')
  const [memberEnrollmentIds, setMemberEnrollmentIds] = useState<number[]>([])

  function closeEditor() {
    setIsCreating(false)
    setEditingTeam(null)
    setName('')
    setMemberEnrollmentIds([])
  }

  function startCreate() {
    setEditingTeam(null)
    setName('')
    setMemberEnrollmentIds([])
    setIsCreating(true)
  }

  function startEdit(team: CompetitionTeam) {
    setIsCreating(false)
    setEditingTeam(team)
    setName(team.name)
    setMemberEnrollmentIds(team.members.map((member) => member.enrollmentId))
  }

  function toggleMember(enrollmentId: number) {
    setMemberEnrollmentIds((current) =>
      current.includes(enrollmentId)
        ? current.filter((id) => id !== enrollmentId)
        : [...current, enrollmentId],
    )
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = { name: name.trim(), memberEnrollmentIds }
    if (!payload.name) return

    if (editingTeam) {
      updateTeam.mutate({ teamId: editingTeam.id, payload }, { onSuccess: closeEditor })
    } else {
      createTeam.mutate(payload, { onSuccess: closeEditor })
    }
  }

  function handleDelete(team: CompetitionTeam) {
    if (confirm(`¿Eliminar el equipo "${team.name}"? Sus atletas seguirán inscritos en la competencia.`)) {
      deleteTeam.mutate(team.id)
    }
  }

  const teamByEnrollmentId = new Map<number, CompetitionTeam>(
    (teams ?? []).flatMap((team) => team.members.map((member) => [member.enrollmentId, team] as const)),
  )
  const isSaving = createTeam.isPending || updateTeam.isPending
  const canManage = isAdmin && !isLoading && !isError

  return (
    <section className="flex flex-col gap-4" aria-labelledby="teams-title">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="teams-title" className="text-lg font-bold text-zinc-100">Equipos</h2>
          <p className="text-sm text-zinc-500">Los atletas conservan la categoría que eligieron al inscribirse.</p>
        </div>
        {canManage && !isCreating && !editingTeam && (
          <button
            type="button"
            onClick={startCreate}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400"
          >
            <Plus size={16} />
            Crear equipo
          </button>
        )}
      </div>

      {isLoading && <p className="text-sm text-zinc-500">Cargando equipos…</p>}
      {isError && <p role="alert" className="text-sm text-red-400">No se pudieron cargar los equipos.</p>}

      {!isLoading && !isError && (teams?.length ?? 0) === 0 && (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-500">
          Todavía no hay equipos creados.
        </p>
      )}

      {teams?.map((team) => (
        <article key={team.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Users className="shrink-0 text-red-500" size={22} />
              <div>
                <h3 className="font-bold text-zinc-100">{team.name}</h3>
                <p className="text-sm text-zinc-500">
                  {team.members.length} {team.members.length === 1 ? 'atleta' : 'atletas'}
                </p>
              </div>
            </div>
            {canManage && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(team)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                  aria-label={`Editar equipo ${team.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(team)}
                  disabled={deleteTeam.isPending}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-60"
                  aria-label={`Eliminar equipo ${team.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {team.members.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {team.members.map((member) => (
                <li
                  key={member.enrollmentId}
                  className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                >
                  <span className="font-medium">{member.userFullName}</span>
                  <span className="ml-2 text-xs text-zinc-400">{member.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">Aún no hay atletas asignados.</p>
          )}
        </article>
      ))}

      {canManage && (isCreating || editingTeam) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="font-bold text-zinc-100">{editingTeam ? 'Editar equipo' : 'Nuevo equipo'}</h3>
          <div>
            <label htmlFor="team-name" className="mb-1.5 block text-sm font-medium text-zinc-300">Nombre del equipo</label>
            <input
              id="team-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
              className={inputStyles}
              placeholder="Ej. Los atletas"
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium text-zinc-300">Atletas inscritos</legend>
            {enrollments.length === 0 ? (
              <p className="text-sm text-zinc-500">Todavía no hay atletas inscritos en esta competencia.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded-lg border border-zinc-800">
                {enrollments.map((enrollment) => {
                  const currentTeam = teamByEnrollmentId.get(enrollment.id)
                  const isSelected = memberEnrollmentIds.includes(enrollment.id)
                  return (
                    <label
                      key={enrollment.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-zinc-800 px-3 py-2.5 last:border-0 hover:bg-zinc-800/60"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMember(enrollment.id)}
                        className="accent-red-500"
                      />
                      <span className="min-w-0 flex-1 text-sm text-zinc-200">{enrollment.userFullName}</span>
                      <span className="text-xs text-zinc-400">{enrollment.category}</span>
                      {currentTeam && currentTeam.id !== editingTeam?.id && (
                        <span className="text-xs text-orange-400">Mover desde {currentTeam.name}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            )}
          </fieldset>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEditor}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? 'Guardando…' : 'Guardar equipo'}
            </button>
          </div>
        </form>
      )}

      {loadingStages || loadingResults ? (
        <p className="text-sm text-zinc-500">Cargando puntajes…</p>
      ) : (
        <ResultsTable
          competitionId={competitionId}
          stages={stages ?? []}
          enrollments={enrollments}
          results={[]}
          isAdmin={isAdmin}
          teams={teams ?? []}
        />
      )}
    </section>
  )
}
