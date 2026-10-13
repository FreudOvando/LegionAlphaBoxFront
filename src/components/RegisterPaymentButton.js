import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import { useCreatePayment } from '@/hooks/useBilling';
export function RegisterPaymentButton({ userId, defaultAmount }) {
    const createPayment = useCreatePayment(userId);
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(defaultAmount?.toString() ?? '');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    function handleSubmit(e) {
        e.preventDefault();
        createPayment.mutate({ userId, amount: amount.trim() ? Number(amount) : null, paymentDate: date }, { onSuccess: () => setOpen(false) });
    }
    if (!open) {
        return (_jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-1.5 rounded-lg bg-red-300/15 px-3 py-1.5 text-xs font-bold text-orange-400 hover:bg-red-300/25", children: [_jsx(CreditCard, { size: 14 }), "Registrar"] }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-1", children: [_jsx("input", { type: "number", min: 0, placeholder: "Monto", value: amount, onChange: (e) => setAmount(e.target.value), className: "w-20 rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-xs text-zinc-100" }), _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-xs text-zinc-100" }), _jsx("button", { type: "submit", disabled: createPayment.isPending, className: "text-emerald-400 hover:text-emerald-300 disabled:opacity-60", "aria-label": "Guardar", children: _jsx(CreditCard, { size: 14 }) }), _jsx("button", { type: "button", onClick: () => setOpen(false), className: "text-zinc-500 hover:text-zinc-300", "aria-label": "Cancelar", children: _jsx(X, { size: 14 }) })] }));
}
