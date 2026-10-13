import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Pencil, Trash2, User } from 'lucide-react';
import { WodTypeBadge } from './WodTypeBadge';
import { ScoreForm } from './ScoreForms';
export function WodCard({ wod, onDelete }) {
    const [showScoreForm, setShowScoreForm] = useState(false);
    const formattedDate = new Date(`${wod.publicationDate}T00:00:00`).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    return (_jsxs("article", { className: "group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm capitalize text-zinc-500", children: formattedDate }), _jsx("h2", { className: "mt-1 text-xl font-bold text-zinc-50", children: wod.name ?? 'WOD del día' })] }), _jsx(WodTypeBadge, { type: wod.type })] }), _jsx("p", { className: "mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-300", children: wod.description }), _jsxs("div", { className: "mt-5 flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("span", { className: "flex items-center gap-1.5 text-sm text-zinc-500", children: [_jsx(User, { size: 14 }), "Coach ", wod.coachName] }), _jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [_jsxs("button", { onClick: () => setShowScoreForm((prev) => !prev), className: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-orange-400 hover:bg-red-300/10", children: [_jsx(ClipboardCheck, { size: 16 }), "Registrar mi puntaje"] }), _jsxs("div", { className: "flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100", children: [_jsx(Link, { to: `/wods/${wod.id}/edit`, className: "rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100", "aria-label": "Editar WOD", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => onDelete(wod.id), className: "rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400", "aria-label": "Eliminar WOD", children: _jsx(Trash2, { size: 16 }) })] })] })] }), showScoreForm && _jsx(ScoreForm, { wodId: wod.id, onClose: () => setShowScoreForm(false) })] }));
}
