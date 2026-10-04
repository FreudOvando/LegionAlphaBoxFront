import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import { useAllPayments, useDeleteUser, useUpdateFee, useUsers } from '@/hooks/useBilling';
import { RegisterPaymentButton } from './RegisterPaymentButton';
import { formatMXN } from '@/lib/currency';
export function MembersBillingTable() {
    const { data: users, isLoading, isError } = useUsers();
    const { data: payments } = useAllPayments();
    const updateFee = useUpdateFee();
    const deleteUser = useDeleteUser();
    const [editingFeeId, setEditingFeeId] = useState(null);
    const [feeDraft, setFeeDraft] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    if (isLoading) {
        return _jsx("p", { className: "text-sm text-zinc-500", children: "Cargando miembros\u2026" });
    }
    if (isError) {
        return _jsx("p", { className: "text-sm text-red-400", children: "No se pudo cargar la lista de miembros." });
    }
    const athletes = users?.filter((u) => u.role === 'ATHLETE') ?? [];
    if (athletes.length === 0) {
        return _jsx("p", { className: "text-sm text-zinc-500", children: "Todav\u00EDa no hay atletas registrados." });
    }
    function paymentsFor(userId) {
        return (payments ?? [])
            .filter((p) => p.userId === userId)
            .sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
    }
    function startEditFee(userId, current) {
        setEditingFeeId(userId);
        setFeeDraft(current?.toString() ?? '');
    }
    function confirmFee(userId) {
        const value = Number(feeDraft);
        if (Number.isNaN(value) || value < 0)
            return;
        updateFee.mutate({ id: userId, monthlyFee: value }, { onSuccess: () => setEditingFeeId(null) });
    }
    function handleDeleteMember(userId, name) {
        const confirmed = confirm(`¿Eliminar a ${name} por completo?\n\n` +
            `Esto borrará TODO su registro de forma permanente: sus puntajes de WODs, ` +
            `sus inscripciones y resultados en competencias, y su historial de pagos. ` +
            `No quedará nada guardado.\n\n` +
            `Si quiere volver a usar la app, tendrá que registrarse de nuevo desde cero.\n\n` +
            `Esta acción no se puede deshacer. ¿Continuar?`);
        if (confirmed) {
            deleteUser.mutate(userId);
        }
    }
    return (_jsx("div", { className: "overflow-x-auto rounded-2xl border border-zinc-800", children: _jsxs("table", { className: "w-full min-w-[700px] text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400", children: [_jsx("th", { className: "px-4 py-3 font-medium" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Atleta" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Mensualidad" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "\u00DAltimo pago" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Pr\u00F3ximo pago" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Estado" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Pago" }), _jsx("th", { className: "px-4 py-3 font-medium" })] }) }), _jsx("tbody", { children: athletes.map((athlete) => {
                        const history = paymentsFor(athlete.id);
                        const latest = history[0];
                        const nextDue = latest ? new Date(`${latest.nextDueDate}T23:59:59`) : null;
                        const isActive = nextDue ? nextDue >= new Date() : false;
                        const isEditingFee = editingFeeId === athlete.id;
                        const isExpanded = expandedId === athlete.id;
                        return (_jsxs(_Fragment, { children: [_jsxs("tr", { className: "border-b border-zinc-800 last:border-0", children: [_jsx("td", { className: "px-2 py-3", children: _jsx("button", { onClick: () => setExpandedId(isExpanded ? null : athlete.id), className: "text-zinc-500 hover:text-zinc-200", "aria-label": "Ver historial", children: isExpanded ? _jsx(ChevronDown, { size: 16 }) : _jsx(ChevronRight, { size: 16 }) }) }), _jsxs("td", { className: "px-4 py-3 font-medium text-zinc-100", children: [athlete.firstName, " ", athlete.lastName] }), _jsx("td", { className: "px-4 py-3", children: isEditingFee ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { autoFocus: true, type: "number", min: 0, value: feeDraft, onChange: (e) => setFeeDraft(e.target.value), className: "w-24 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-zinc-100" }), _jsx("button", { onClick: () => confirmFee(athlete.id), className: "text-emerald-400 hover:text-emerald-300", "aria-label": "Guardar", children: _jsx(Check, { size: 14 }) }), _jsx("button", { onClick: () => setEditingFeeId(null), className: "text-zinc-500 hover:text-zinc-300", "aria-label": "Cancelar", children: _jsx(X, { size: 14 }) })] })) : (_jsxs("button", { onClick: () => startEditFee(athlete.id, athlete.monthlyFee), className: "group inline-flex items-center gap-1 text-zinc-300 hover:text-orange-400", children: [formatMXN(athlete.monthlyFee), _jsx(Pencil, { size: 12, className: "opacity-0 group-hover:opacity-100" })] })) }), _jsx("td", { className: "px-4 py-3 text-zinc-300", children: latest ? new Date(`${latest.paymentDate}T00:00:00`).toLocaleDateString('es-MX') : 'Sin pagos' }), _jsx("td", { className: "px-4 py-3 text-zinc-300", children: latest ? new Date(`${latest.nextDueDate}T00:00:00`).toLocaleDateString('es-MX') : '—' }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `font-semibold ${isActive ? 'text-emerald-400' : 'text-red-400'}`, children: isActive ? 'Vigente' : 'Vencida' }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(RegisterPaymentButton, { userId: athlete.id, defaultAmount: athlete.monthlyFee ?? null }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => handleDeleteMember(athlete.id, `${athlete.firstName} ${athlete.lastName}`), className: "text-zinc-500 hover:text-red-400", "aria-label": `Eliminar a ${athlete.firstName} ${athlete.lastName}`, children: _jsx(Trash2, { size: 16 }) }) })] }, athlete.id), isExpanded && (_jsxs("tr", { className: "border-b border-zinc-800 bg-zinc-950/40 last:border-0", children: [_jsx("td", {}), _jsx("td", { colSpan: 7, className: "px-4 py-3", children: history.length === 0 ? (_jsx("p", { className: "text-xs text-zinc-500", children: "Sin historial de pagos." })) : (_jsxs("table", { className: "w-full max-w-sm text-xs", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-zinc-500", children: [_jsx("th", { className: "pb-1 text-left font-medium", children: "Fecha" }), _jsx("th", { className: "pb-1 text-left font-medium", children: "Monto" })] }) }), _jsx("tbody", { children: history.map((payment) => (_jsxs("tr", { children: [_jsx("td", { className: "py-0.5 text-zinc-300", children: new Date(`${payment.paymentDate}T00:00:00`).toLocaleDateString('es-MX') }), _jsx("td", { className: "py-0.5 text-zinc-300", children: formatMXN(payment.amount) })] }, payment.id))) })] })) })] }))] }));
                    }) })] }) }));
}
