import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { useAllPayments, useDeleteUser, useUpdateFee, useUsers } from '@/hooks/useBilling'
import { RegisterPaymentButton } from './RegisterPaymentButton'
import { formatMXN } from '@/lib/currency'

export function MembersBillingTable() {
  const { data: users, isLoading, isError } = useUsers()
  const { data: payments } = useAllPayments()
  const updateFee = useUpdateFee()
  const deleteUser = useDeleteUser()

  const [editingFeeId, setEditingFeeId] = useState<number | null>(null)
  const [feeDraft, setFeeDraft] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Cargando miembros…</p>
  }
  if (isError) {
    return <p className="text-sm text-red-400">No se pudo cargar la lista de miembros.</p>
  }

  const athletes = users?.filter((u) => u.role === 'ATHLETE') ?? []

  if (athletes.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no hay atletas registrados.</p>
  }

  function paymentsFor(userId: number) {
    return (payments ?? [])
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.paymentDate.localeCompare(a.paymentDate))
  }

  function startEditFee(userId: number, current: number | null | undefined) {
    setEditingFeeId(userId)
    setFeeDraft(current?.toString() ?? '')
  }

  function confirmFee(userId: number) {
    const value = Number(feeDraft)
    if (Number.isNaN(value) || value < 0) return
    updateFee.mutate({ id: userId, monthlyFee: value }, { onSuccess: () => setEditingFeeId(null) })
  }

  function handleDeleteMember(userId: number, name: string) {
    const confirmed = confirm(
      `¿Eliminar a ${name} por completo?\n\n` +
        `Esto borrará TODO su registro de forma permanente: sus puntajes de WODs, ` +
        `sus inscripciones y resultados en competencias, y su historial de pagos. ` +
        `No quedará nada guardado.\n\n` +
        `Si quiere volver a usar la app, tendrá que registrarse de nuevo desde cero.\n\n` +
        `Esta acción no se puede deshacer. ¿Continuar?`,
    )
    if (confirmed) {
      deleteUser.mutate(userId)
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400">
            <th className="px-4 py-3 font-medium"></th>
            <th className="px-4 py-3 font-medium">Atleta</th>
            <th className="px-4 py-3 font-medium">Mensualidad</th>
            <th className="px-4 py-3 font-medium">Último pago</th>
            <th className="px-4 py-3 font-medium">Próximo pago</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Pago</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => {
            const history = paymentsFor(athlete.id)
            const latest = history[0]
            const nextDue = latest ? new Date(`${latest.nextDueDate}T23:59:59`) : null
            const isActive = nextDue ? nextDue >= new Date() : false
            const isEditingFee = editingFeeId === athlete.id
            const isExpanded = expandedId === athlete.id

            return (
              <>
                <tr key={athlete.id} className="border-b border-zinc-800 last:border-0">
                  <td className="px-2 py-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : athlete.id)}
                      className="text-zinc-500 hover:text-zinc-200"
                      aria-label="Ver historial"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-100">
                    {athlete.firstName} {athlete.lastName}
                  </td>
                  <td className="px-4 py-3">
                    {isEditingFee ? (
                      <div className="flex items-center gap-1">
                        <input
                          autoFocus
                          type="number"
                          min={0}
                          value={feeDraft}
                          onChange={(e) => setFeeDraft(e.target.value)}
                          className="w-24 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-100"
                        />
                        <button onClick={() => confirmFee(athlete.id)} className="text-emerald-400 hover:text-emerald-300" aria-label="Guardar">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingFeeId(null)} className="text-zinc-500 hover:text-zinc-300" aria-label="Cancelar">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditFee(athlete.id, athlete.monthlyFee)}
                        className="group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400"
                      >
                        {formatMXN(athlete.monthlyFee)}
                        <Pencil size={12} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {latest ? new Date(`${latest.paymentDate}T00:00:00`).toLocaleDateString('es-MX') : 'Sin pagos'}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {latest ? new Date(`${latest.nextDueDate}T00:00:00`).toLocaleDateString('es-MX') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isActive ? 'Vigente' : 'Vencida'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RegisterPaymentButton userId={athlete.id} defaultAmount={athlete.monthlyFee ?? null} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteMember(athlete.id, `${athlete.firstName} ${athlete.lastName}`)}
                      className="text-zinc-500 hover:text-red-400"
                      aria-label={`Eliminar a ${athlete.firstName} ${athlete.lastName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 last:border-0">
                    <td></td>
                    <td colSpan={7} className="px-4 py-3">
                      {history.length === 0 ? (
                        <p className="text-xs text-zinc-500">Sin historial de pagos.</p>
                      ) : (
                        <table className="w-full max-w-sm text-xs">
                          <thead>
                            <tr className="text-zinc-500">
                              <th className="pb-1 text-left font-medium">Fecha</th>
                              <th className="pb-1 text-left font-medium">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history.map((payment) => (
                              <tr key={payment.id}>
                                <td className="py-0.5 text-zinc-300">
                                  {new Date(`${payment.paymentDate}T00:00:00`).toLocaleDateString('es-MX')}
                                </td>
                                <td className="py-0.5 text-zinc-300">{formatMXN(payment.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}