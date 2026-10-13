import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Trophy } from 'lucide-react';
export function CompetitionCard({ competition, isAdmin, onDelete }) {
    const formattedDate = new Date(`${competition.competitionDate}T00:00:00`).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (_jsxs("article", { className: "group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700", children: [_jsxs(Link, { to: `/competitions/${competition.id}`, className: "flex items-center gap-3", children: [_jsx(Trophy, { className: "text-red-500", size: 24 }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-zinc-50", children: competition.name }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("p", { className: "text-sm capitalize text-zinc-500", children: formattedDate }), _jsx("span", { className: "rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400", children: competition.type === 'TEAM' ? 'En equipos' : 'Individual' })] })] })] }), isAdmin && (_jsxs("div", { className: "flex items-center gap-1 opacity-0 transition group-hover:opacity-100", children: [_jsx(Link, { to: `/competitions/${competition.id}/edit`, className: "rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100", "aria-label": "Editar competencia", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { onClick: () => onDelete(competition.id), className: "rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400", "aria-label": "Eliminar competencia", children: _jsx(Trash2, { size: 16 }) })] }))] }));
}
