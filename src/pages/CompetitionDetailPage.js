import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCompetition } from '@/hooks/useCompetitions';
import { useEnrollments, useResults, useStages } from '@/hooks/useCompetitionDetail';
import { StageManager } from '@/components/StageManager';
import { EnrollmentPanel } from '@/components/EnrollmentPanel';
import { ResultsTable } from '@/components/ResultsTable';
import { TeamManager } from '@/components/TeamManager';
export function CompetitionDetailPage() {
    const { id } = useParams();
    const competitionId = Number(id);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const { data: competition, isLoading: loadingCompetition } = useCompetition(competitionId);
    const { data: stages, isLoading: loadingStages } = useStages(competitionId);
    const { data: enrollments, isLoading: loadingEnrollments } = useEnrollments(competitionId);
    const { data: results, isLoading: loadingResults } = useResults(competitionId);
    const isLoading = loadingCompetition || loadingStages || loadingEnrollments || loadingResults;
    if (isLoading || !competition) {
        return _jsx("p", { className: "text-center text-zinc-500", children: "Cargando competencia\u2026" });
    }
    const formattedDate = new Date(`${competition.competitionDate}T00:00:00`).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs(Link, { to: "/competitions", className: "inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300", children: [_jsx(ArrowLeft, { size: 16 }), "Volver a competencias"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-zinc-50", children: competition.name }), _jsx("p", { className: "text-sm capitalize text-zinc-500", children: formattedDate })] }), isAdmin && _jsx(StageManager, { competitionId: competitionId }), _jsx(EnrollmentPanel, { competitionId: competitionId }), competition.type === 'TEAM' ? (_jsx(TeamManager, { competitionId: competitionId, enrollments: enrollments ?? [], isAdmin: isAdmin })) : (_jsx(ResultsTable, { competitionId: competitionId, stages: stages ?? [], enrollments: enrollments ?? [], results: results ?? [], isAdmin: isAdmin }))] }));
}
