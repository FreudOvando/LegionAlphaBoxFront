import { CreditCard, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCreatePayment, useMe, useUserPayments } from '@/hooks/useBilling'
import { formatMXN } from '@/lib/currency'

export function MyMembershipCard() {
  const { user } = useAuth()
  const { data: me } = useMe()
  const { data: payments } = useUserPayments(user?.id ?? 0)
  const createPayment = useCreatePayment(user?.id ?? 0)

  if (!user) return null

  const latest = payments?.[0]
  const nextDue = latest ? new Date(`${latest.nextDueDate}T23:59:59`) : null
  const isActive = nextDue ? nextDue >= new Date() : false
  const daysUntilDue = nextDue ? Math.ceil((nextDue.getTime() - Date.now()) / 86_400_000) : null
  const showWarning = isActive && daysUntilDue !== null && daysUntilDue <= 5

  function handlePay() {
    createPayment.mutate({ userId: user!.id, amount: null, paymentDate: null })
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-400">Mi mensualidad</h2>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-zinc-500">Monto</p>
          <p className="font-semibold text-zinc-100">{formatMXN(me?.monthlyFee)}</p>
        </div>
        <div>
          <p className="text-zinc-500">Último pago</p>
          <p className="font-semibold text-zinc-100">
            {latest ? new Date(`${latest.paymentDate}T00:00:00`).toLocaleDateString('es-MX') : 'Sin pagos'}
          </p>
        </div>
        <div>
          <p className="text-zinc-500">Próximo pago</p>
          <p className="font-semibold text-zinc-100">
            {latest ? new Date(`${latest.nextDueDate}T00:00:00`).toLocaleDateString('es-MX') : '—'}
          </p>
        </div>
        <div>
          <p className="text-zinc-500">Estado</p>
          <p className={`font-semibold ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isActive ? 'Vigente' : 'Vencida'}
          </p>
        </div>
      </div>

      {showWarning && (
        <p className="mb-4 text-sm text-amber-400">
          Tu mensualidad vence en {daysUntilDue} día{daysUntilDue === 1 ? '' : 's'}.
        </p>
      )}

      {me?.monthlyFee == null ? (
        <p className="text-sm text-zinc-500">Tu entrenador todavía no configuró tu mensualidad.</p>
      ) : (
        <button
          onClick={handlePay}
          disabled={createPayment.isPending}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:opacity-60"
        >
          {createPayment.isPending ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
          Registrar mi pago
        </button>
      )}
    </div>
  )
}