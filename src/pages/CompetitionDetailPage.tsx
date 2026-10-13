import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCompetition } from '@/hooks/useCompetitions'
import { useEnrollments, useResults, useStages } from '@/hooks/useCompetitionDetail'
import { StageManager } from '@/components/StageManager'
import { EnrollmentPanel } from '@/components/EnrollmentPanel'
import { ResultsTable } from '@/components/ResultsTable'
import { TeamManager } from '@/components/TeamManager'

export function CompetitionDetailPage() {
  const { id } = useParams()
  const competitionId = Number(id)
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const { data: competition, isLoading: loadingCompetition } = useCompetition(competitionId)
  const { data: stages, isLoading: loadingStages } = useStages(competitionId)
  const { data: enrollments, isLoading: loadingEnrollments } = useEnrollments(competitionId)
  const { data: results, isLoading: loadingResults } = useResults(competitionId)

  const isLoading = loadingCompetition || loadingStages || loadingEnrollments || loadingResults

  if (isLoading || !competition) {
    return <p className="text-center text-zinc-500">Cargando competencia…</p>
  }

  const formattedDate = new Date(`${competition.competitionDate}T00:00:00`).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-6">
      <Link to="/competitions" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300">
        <ArrowLeft size={16} />
        Volver a competencias
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-50">{competition.name}</h1>
        <p className="text-sm capitalize text-zinc-500">{formattedDate}</p>
      </div>

      {isAdmin && <StageManager competitionId={competitionId} />}

      <EnrollmentPanel competitionId={competitionId} />

      {competition.type === 'TEAM' ? (
        <TeamManager
          competitionId={competitionId}
          enrollments={enrollments ?? []}
          isAdmin={isAdmin}
        />
      ) : (
        <ResultsTable
          competitionId={competitionId}
          stages={stages ?? []}
          enrollments={enrollments ?? []}
          results={results ?? []}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}