import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePayment, useMe, useUserPayments } from '@/hooks/useBilling';
import { formatMXN } from '@/lib/currency';
export function MyMembershipCard() {
    const { user } = useAuth();
    const { data: me } = useMe();
    const { data: payments } = useUserPayments(user?.id ?? 0);
    const createPayment = useCreatePayment(user?.id ?? 0);
    if (!user)
        return null;
    const latest = payments?.[0];
    const nextDue = latest ? new Date(`${latest.nextDueDate}T23:59:59`) : null;
    const isActive = nextDue ? nextDue >= new Date() : false;
    const daysUntilDue = nextDue ? Math.ceil((nextDue.getTime() - Date.now()) / 86_400_000) : null;
    const showWarning = isActive && daysUntilDue !== null && daysUntilDue <= 5;
    function handlePay() {
        createPayment.mutate({ userId: user.id, amount: null, paymentDate: null });
    }
    return (_jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5", children: [_jsx("h2", { className: "mb-4 text-sm font-bold uppercase tracking-wide text-zinc-400", children: "Mi mensualidad" }), _jsxs("div", { className: "mb-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-zinc-500", children: "Monto" }), _jsx("p", { className: "font-semibold text-zinc-100", children: formatMXN(me?.monthlyFee) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-zinc-500", children: "\u00DAltimo pago" }), _jsx("p", { className: "font-semibold text-zinc-100", children: latest ? new Date(`${latest.paymentDate}T00:00:00`).toLocaleDateString('es-MX') : 'Sin pagos' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-zinc-500", children: "Pr\u00F3ximo pago" }), _jsx("p", { className: "font-semibold text-zinc-100", children: latest ? new Date(`${latest.nextDueDate}T00:00:00`).toLocaleDateString('es-MX') : '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-zinc-500", children: "Estado" }), _jsx("p", { className: `font-semibold ${isActive ? 'text-emerald-400' : 'text-red-400'}`, children: isActive ? 'Vigente' : 'Vencida' })] })] }), showWarning && (_jsxs("p", { className: "mb-4 text-sm text-amber-400", children: ["Tu mensualidad vence en ", daysUntilDue, " d\u00EDa", daysUntilDue === 1 ? '' : 's', "."] })), me?.monthlyFee == null ? (_jsx("p", { className: "text-sm text-zinc-500", children: "Tu entrenador todav\u00EDa no configur\u00F3 tu mensualidad." })) : (_jsxs("button", { onClick: handlePay, disabled: createPayment.isPending, className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400 disabled:opacity-60", children: [createPayment.isPending ? _jsx(Loader2, { size: 16, className: "animate-spin" }) : _jsx(CreditCard, { size: 16 }), "Registrar mi pago"] }))] }));
}
