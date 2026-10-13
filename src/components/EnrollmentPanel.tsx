import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useEnroll, useEnrollments } from '@/hooks/useCompetitionDetail'
import { COMPETITION_CATEGORIES, type CompetitionCategory } from '@/types/competition'

export function EnrollmentPanel({ competitionId }: { competitionId: number }) {
  const { user } = useAuth()
  const { data: enrollments } = useEnrollments(competitionId)
  const enroll = useEnroll(competitionId)
  const [category, setCategory] = useState<CompetitionCategory>('PRINCIPIANTE')

  const myEnrollment = enrollments?.find((e) => e.userId === user?.id)

  if (myEnrollment) {
    return (
      <p className="text-sm text-zinc-400">
        Ya estás inscrito en esta competencia, categoría{' '}
        <span className="font-semibold text-orange-400">{myEnrollment.category}</span>.
      </p>
    )
  }

  function handleEnroll() {
    if (!user) return
    enroll.mutate({ userId: user.id, category })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as CompetitionCategory)}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-red-500 focus:outline-none"
      >
        {COMPETITION_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button
        onClick={handleEnroll}
        disabled={enroll.isPending}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 disabled:opacity-60"
      >
        <UserPlus size={16} />
        Inscribirme
      </button>
    </div>
  )
}