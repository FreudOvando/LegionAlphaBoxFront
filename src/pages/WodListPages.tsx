import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { useDeleteWod, useWods } from '@/hooks/useWods'
import { useAuth } from '@/hooks/useAuth'
import { WodCard } from '@/components/WodCard'
import { Leaderboard } from '@/components/LeaderBoard'

function toDateInputValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function WodListPage() {
  const { data: wods, isLoading, isError } = useWods()
  const deleteWod = useDeleteWod()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isHistory = pathname === '/history'
  const today = toDateInputValue(new Date())
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return toDateInputValue(yesterday)
  })

  function handleDelete(id: number) {
    if (confirm('¿Eliminar este WOD y todas las puntuaciones registradas por los atletas? Esta acción no se puede deshacer.')) {
      deleteWod.mutate(id)
    }
  }

  if (isLoading) {
    return <p className="text-center text-zinc-500">Cargando WODs…</p>
  }

  if (isError) {
    return (
      <p className="text-center text-red-400">
        No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 8080?
      </p>
    )
  }

  const visibleWods = (wods ?? []).filter((wod) =>
    isHistory ? wod.publicationDate === selectedDate && wod.publicationDate < today : wod.publicationDate === today,
  )

  if (!isHistory && visibleWods.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Dumbbell className="text-zinc-700" size={48} />
        <p className="text-zinc-500">Todavía no hay WOD publicado para hoy.</p>
        {user?.role === 'ADMIN' && (
          <Link to="/wods/new" className="text-sm font-semibold text-orange-400 hover:text-orange-300">
            Agregar WOD
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {isHistory && (
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Historial de WODs</h1>
            <p className="mt-1 text-sm text-zinc-500">Consulta entrenamientos de días anteriores.</p>
          </div>
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-400">
            Fecha
            <input
              type="date"
              value={selectedDate}
              max={toDateInputValue(new Date(new Date().setDate(new Date().getDate() - 1)))}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
        </div>
      )}
      {visibleWods.map((wod) => (
        <div key={wod.id} className="flex flex-col gap-3">
          <WodCard wod={wod} onDelete={handleDelete} />
          <Leaderboard wodId={wod.id} />
        </div>
      ))}
      {isHistory && visibleWods.length === 0 && (
        <p className="py-10 text-center text-sm text-zinc-500">No hay un WOD publicado para esa fecha.</p>
      )}
    </div>
  )
}