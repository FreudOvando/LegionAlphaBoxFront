import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Plus, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCompetitions, useDeleteCompetition } from '@/hooks/useCompetitions';
import { CompetitionCard } from '@/components/CompetitionCard';
export function CompetitionListPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [showCreateOptions, setShowCreateOptions] = useState(false);
    const { data: competitions, isLoading, isError } = useCompetitions();
    const deleteCompetition = useDeleteCompetition();
    function handleDelete(id) {
        if (confirm('¿Eliminar esta competencia? Esta acción no se puede deshacer.')) {
            deleteCompetition.mutate(id);
        }
    }
    if (isLoading) {
        return _jsx("p", { className: "text-center text-zinc-500", children: "Cargando competencias\u2026" });
    }
    if (isError) {
        return _jsx("p", { className: "text-center text-red-400", children: "No se pudo conectar con el servidor." });
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-zinc-50", children: "Competencias" }), isAdmin && (_jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", "aria-haspopup": "menu", "aria-expanded": showCreateOptions, onClick: () => setShowCreateOptions((open) => !open), className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400", children: [_jsx(Plus, { size: 18, strokeWidth: 3 }), "Nueva competencia", _jsx(ChevronDown, { size: 16 })] }), showCreateOptions && (_jsxs("div", { role: "menu", className: "absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl", children: [_jsx(Link, { role: "menuitem", to: "/competitions/new?type=INDIVIDUAL", onClick: () => setShowCreateOptions(false), className: "block px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800", children: "Individual" }), _jsx(Link, { role: "menuitem", to: "/competitions/new?type=TEAM", onClick: () => setShowCreateOptions(false), className: "block px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800", children: "En equipos" })] }))] }))] }), !competitions || competitions.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center gap-3 py-20 text-center", children: [_jsx(Trophy, { className: "text-zinc-700", size: 48 }), _jsx("p", { className: "text-zinc-500", children: "Todav\u00EDa no hay competencias creadas." })] })) : (_jsx("div", { className: "flex flex-col gap-4", children: competitions.map((competition) => (_jsx(CompetitionCard, { competition: competition, isAdmin: isAdmin, onDelete: handleDelete }, competition.id))) }))] }));
}
