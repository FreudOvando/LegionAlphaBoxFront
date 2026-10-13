import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCompetitions, useDeleteCompetition } from '@/hooks/useCompetitions';
import { CompetitionCard } from '@/components/CompetitionCard';
export function CompetitionListPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
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
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-zinc-50", children: "Competencias" }), isAdmin && (_jsxs(Link, { to: "/competitions/new", className: "flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-orange-400", children: [_jsx(Plus, { size: 18, strokeWidth: 3 }), "Nueva competencia"] }))] }), !competitions || competitions.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center gap-3 py-20 text-center", children: [_jsx(Trophy, { className: "text-zinc-700", size: 48 }), _jsx("p", { className: "text-zinc-500", children: "Todav\u00EDa no hay competencias creadas." })] })) : (_jsx("div", { className: "flex flex-col gap-4", children: competitions.map((competition) => (_jsx(CompetitionCard, { competition: competition, isAdmin: isAdmin, onDelete: handleDelete }, competition.id))) }))] }));
}
